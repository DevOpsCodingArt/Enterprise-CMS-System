import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { eq, and, asc, count, inArray } from 'drizzle-orm';
import { DbService } from '../../db/db.service';
import * as schema from '../../db/schema';
import { RedisService } from '../../core/redis/redis.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { SetUserOverridesDto } from './dto/set-user-overrides.dto';

@Injectable()
export class RbacService {
  private readonly logger = new Logger(RbacService.name);

  constructor(
    private readonly dbService: DbService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 1. Get Categorized System Permissions
   */
  async getCategories() {
    const db = this.dbService.db;

    const categories = await db
      .select()
      .from(schema.permissionCategories)
      .orderBy(asc(schema.permissionCategories.displayOrder));

    const allPermissions = await db
      .select()
      .from(schema.permissions)
      .orderBy(asc(schema.permissions.name));

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      permissions: allPermissions
        .filter((p) => p.categoryId === cat.id)
        .map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          isSystem: p.isSystem,
        })),
    }));
  }

  /**
   * 2. Get Flat List of All Permissions
   */
  async getPermissions() {
    const db = this.dbService.db;

    return db
      .select({
        id: schema.permissions.id,
        categoryId: schema.permissions.categoryId,
        categoryName: schema.permissionCategories.name,
        categorySlug: schema.permissionCategories.slug,
        name: schema.permissions.name,
        slug: schema.permissions.slug,
        description: schema.permissions.description,
        isSystem: schema.permissions.isSystem,
      })
      .from(schema.permissions)
      .leftJoin(
        schema.permissionCategories,
        eq(schema.permissions.categoryId, schema.permissionCategories.id),
      )
      .orderBy(
        asc(schema.permissionCategories.displayOrder),
        asc(schema.permissions.name),
      );
  }

  /**
   * 3. List Permission Groups with Member Counts & Permissions
   */
  async getGroups(companyId: string) {
    const db = this.dbService.db;

    const groups = await db
      .select()
      .from(schema.permissionGroups)
      .where(eq(schema.permissionGroups.companyId, companyId))
      .orderBy(asc(schema.permissionGroups.createdAt));

    const result = await Promise.all(
      groups.map(async (grp) => {
        // Count members in this group
        const [{ memberCount }] = await db
          .select({ memberCount: count() })
          .from(schema.userPermissionGroups)
          .where(eq(schema.userPermissionGroups.permissionGroupId, grp.id));

        // Get permissions assigned to this group
        const groupPerms = await db
          .select({
            permissionId: schema.permissionGroupPermissions.permissionId,
            permissionSlug: schema.permissions.slug,
            permissionName: schema.permissions.name,
          })
          .from(schema.permissionGroupPermissions)
          .innerJoin(
            schema.permissions,
            eq(
              schema.permissionGroupPermissions.permissionId,
              schema.permissions.id,
            ),
          )
          .where(
            and(
              eq(schema.permissionGroupPermissions.permissionGroupId, grp.id),
              eq(schema.permissionGroupPermissions.granted, true),
            ),
          );

        return {
          id: grp.id,
          name: grp.name,
          description: grp.description,
          isDefault: grp.isDefault,
          memberCount: Number(memberCount),
          permissionCount: groupPerms.length,
          permissionIds: groupPerms.map((p) => p.permissionId),
          permissions: groupPerms.map((p) => p.permissionSlug),
          createdAt: grp.createdAt,
          updatedAt: grp.updatedAt,
        };
      }),
    );

    return result;
  }

  /**
   * 4. Get Group Details with Member Users
   */
  async getGroupById(companyId: string, groupId: string) {
    const db = this.dbService.db;

    const [group] = await db
      .select()
      .from(schema.permissionGroups)
      .where(
        and(
          eq(schema.permissionGroups.companyId, companyId),
          eq(schema.permissionGroups.id, groupId),
        ),
      )
      .limit(1);

    if (!group) {
      throw new NotFoundException(
        `Permission group with ID ${groupId} not found`,
      );
    }

    // Fetch assigned permissions
    const permissionsList = await db
      .select({
        id: schema.permissions.id,
        name: schema.permissions.name,
        slug: schema.permissions.slug,
        categoryId: schema.permissions.categoryId,
        categoryName: schema.permissionCategories.name,
      })
      .from(schema.permissionGroupPermissions)
      .innerJoin(
        schema.permissions,
        eq(
          schema.permissionGroupPermissions.permissionId,
          schema.permissions.id,
        ),
      )
      .leftJoin(
        schema.permissionCategories,
        eq(schema.permissions.categoryId, schema.permissionCategories.id),
      )
      .where(
        and(
          eq(schema.permissionGroupPermissions.permissionGroupId, groupId),
          eq(schema.permissionGroupPermissions.granted, true),
        ),
      );

    // Fetch assigned member users
    const members = await db
      .select({
        id: schema.users.id,
        fullName: schema.users.fullName,
        displayName: schema.users.displayName,
        email: schema.users.email,
        username: schema.users.username,
        department: schema.users.department,
        designation: schema.users.designation,
        isActive: schema.users.isActive,
      })
      .from(schema.userPermissionGroups)
      .innerJoin(
        schema.users,
        eq(schema.userPermissionGroups.userId, schema.users.id),
      )
      .where(eq(schema.userPermissionGroups.permissionGroupId, groupId));

    return {
      id: group.id,
      name: group.name,
      description: group.description,
      isDefault: group.isDefault,
      permissions: permissionsList,
      members,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
    };
  }

  /**
   * 5. Create Permission Group
   */
  async createGroup(companyId: string, dto: CreateGroupDto) {
    const db = this.dbService.db;

    const [newGroup] = await db
      .insert(schema.permissionGroups)
      .values({
        companyId,
        name: dto.name.trim(),
        description: dto.description || null,
        isDefault: dto.isDefault || false,
      })
      .returning();

    if (dto.permissionIds && dto.permissionIds.length > 0) {
      await db.insert(schema.permissionGroupPermissions).values(
        dto.permissionIds.map((pId) => ({
          permissionGroupId: newGroup.id,
          permissionId: pId,
          granted: true,
        })),
      );
    }

    this.logger.log(
      `🛡️ [RBAC Group Created] "${newGroup.name}" in tenant ${companyId}`,
    );
    return this.getGroupById(companyId, newGroup.id);
  }

  /**
   * 6. Update Permission Group & Invalidate Member Caches
   */
  async updateGroup(companyId: string, groupId: string, dto: UpdateGroupDto) {
    const db = this.dbService.db;

    const [existing] = await db
      .select()
      .from(schema.permissionGroups)
      .where(
        and(
          eq(schema.permissionGroups.companyId, companyId),
          eq(schema.permissionGroups.id, groupId),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundException(
        `Permission group with ID ${groupId} not found`,
      );
    }

    // Update group metadata
    await db
      .update(schema.permissionGroups)
      .set({
        name: dto.name ? dto.name.trim() : existing.name,
        description:
          dto.description !== undefined
            ? dto.description
            : existing.description,
        isDefault:
          dto.isDefault !== undefined ? dto.isDefault : existing.isDefault,
        updatedAt: new Date(),
      })
      .where(eq(schema.permissionGroups.id, groupId));

    // Update assigned permissions if provided
    if (dto.permissionIds) {
      // Clear old permissions
      await db
        .delete(schema.permissionGroupPermissions)
        .where(
          eq(schema.permissionGroupPermissions.permissionGroupId, groupId),
        );

      // Insert new permissions
      if (dto.permissionIds.length > 0) {
        await db.insert(schema.permissionGroupPermissions).values(
          dto.permissionIds.map((pId) => ({
            permissionGroupId: groupId,
            permissionId: pId,
            granted: true,
          })),
        );
      }
    }

    // Invalidate Redis permissions cache for all members of this group
    const members = await db
      .select({ userId: schema.userPermissionGroups.userId })
      .from(schema.userPermissionGroups)
      .where(eq(schema.userPermissionGroups.permissionGroupId, groupId));

    for (const member of members) {
      await this.redisService.del(`perms:${member.userId}`);
    }

    this.logger.log(
      `🔄 [RBAC Group Updated] "${existing.name}" - ${members.length} member caches invalidated`,
    );
    return this.getGroupById(companyId, groupId);
  }

  /**
   * 7. Delete Custom Permission Group
   */
  async deleteGroup(companyId: string, groupId: string) {
    const db = this.dbService.db;

    const [existing] = await db
      .select()
      .from(schema.permissionGroups)
      .where(
        and(
          eq(schema.permissionGroups.companyId, companyId),
          eq(schema.permissionGroups.id, groupId),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundException(
        `Permission group with ID ${groupId} not found`,
      );
    }

    if (existing.isDefault) {
      throw new BadRequestException(
        'System default permission groups cannot be deleted.',
      );
    }

    // Invalidate member caches before deletion
    const members = await db
      .select({ userId: schema.userPermissionGroups.userId })
      .from(schema.userPermissionGroups)
      .where(eq(schema.userPermissionGroups.permissionGroupId, groupId));

    for (const member of members) {
      await this.redisService.del(`perms:${member.userId}`);
    }

    await db
      .delete(schema.permissionGroups)
      .where(eq(schema.permissionGroups.id, groupId));

    return {
      message: `Permission group "${existing.name}" deleted successfully`,
    };
  }

  /**
   * 8. Person-Level Permission Matrix Inspector
   * Returns exact inherited group permissions, individual overrides, and final effective permissions
   */
  async getUserPermissionMatrix(companyId: string, userId: string) {
    const db = this.dbService.db;

    const [user] = await db
      .select({
        id: schema.users.id,
        fullName: schema.users.fullName,
        displayName: schema.users.displayName,
        email: schema.users.email,
        username: schema.users.username,
        department: schema.users.department,
        designation: schema.users.designation,
        branchId: schema.users.branchId,
        userType: schema.users.userType,
        isActive: schema.users.isActive,
      })
      .from(schema.users)
      .where(
        and(eq(schema.users.companyId, companyId), eq(schema.users.id, userId)),
      )
      .limit(1);

    if (!user) {
      throw new NotFoundException(
        `Staff user with ID ${userId} not found in this company`,
      );
    }

    // Company Owner has full wildcard
    if (user.userType === 'company_owner') {
      return {
        user,
        isRoot: true,
        assignedGroups: [],
        inheritedPermissions: ['*'],
        individualOverrides: [],
        effectivePermissions: ['*'],
      };
    }

    // Fetch Assigned Groups
    const userGroups = await db
      .select({
        id: schema.permissionGroups.id,
        name: schema.permissionGroups.name,
        description: schema.permissionGroups.description,
      })
      .from(schema.userPermissionGroups)
      .innerJoin(
        schema.permissionGroups,
        eq(
          schema.userPermissionGroups.permissionGroupId,
          schema.permissionGroups.id,
        ),
      )
      .where(eq(schema.userPermissionGroups.userId, userId));

    const groupIds = userGroups.map((g) => g.id);

    // Fetch Inherited Group Permissions
    const inheritedPerms =
      groupIds.length > 0
        ? await db
            .select({
              permissionId: schema.permissionGroupPermissions.permissionId,
              slug: schema.permissions.slug,
              name: schema.permissions.name,
              categoryName: schema.permissionCategories.name,
            })
            .from(schema.permissionGroupPermissions)
            .innerJoin(
              schema.permissions,
              eq(
                schema.permissionGroupPermissions.permissionId,
                schema.permissions.id,
              ),
            )
            .leftJoin(
              schema.permissionCategories,
              eq(schema.permissions.categoryId, schema.permissionCategories.id),
            )
            .where(
              and(
                inArray(
                  schema.permissionGroupPermissions.permissionGroupId,
                  groupIds,
                ),
                eq(schema.permissionGroupPermissions.granted, true),
              ),
            )
        : [];

    const inheritedSlugs = Array.from(
      new Set(inheritedPerms.map((p) => p.slug)),
    );

    // Fetch Person-Level Overrides (Explicit grants or denies)
    const overrides = await db
      .select({
        permissionId: schema.userPermissionOverrides.permissionId,
        slug: schema.permissions.slug,
        name: schema.permissions.name,
        categoryName: schema.permissionCategories.name,
        granted: schema.userPermissionOverrides.granted,
      })
      .from(schema.userPermissionOverrides)
      .innerJoin(
        schema.permissions,
        eq(schema.userPermissionOverrides.permissionId, schema.permissions.id),
      )
      .leftJoin(
        schema.permissionCategories,
        eq(schema.permissions.categoryId, schema.permissionCategories.id),
      )
      .where(eq(schema.userPermissionOverrides.userId, userId));

    // Calculate Final Effective Permission Slugs
    const effectiveSet = new Set<string>(inheritedSlugs);

    for (const ov of overrides) {
      if (ov.granted) {
        effectiveSet.add(ov.slug);
      } else {
        effectiveSet.delete(ov.slug);
      }
    }

    return {
      user,
      isRoot: false,
      assignedGroups: userGroups,
      inheritedPermissions: inheritedSlugs,
      individualOverrides: overrides,
      effectivePermissions: Array.from(effectiveSet),
    };
  }

  /**
   * 9. Assign Permission Groups to a Specific User
   */
  async assignUserGroups(
    companyId: string,
    userId: string,
    groupIds: string[],
    assignedBy?: string,
  ) {
    const db = this.dbService.db;

    // Verify user exists in company
    const [user] = await db
      .select()
      .from(schema.users)
      .where(
        and(eq(schema.users.companyId, companyId), eq(schema.users.id, userId)),
      )
      .limit(1);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Delete existing group links
    await db
      .delete(schema.userPermissionGroups)
      .where(eq(schema.userPermissionGroups.userId, userId));

    // Insert new group links
    if (groupIds.length > 0) {
      await db.insert(schema.userPermissionGroups).values(
        groupIds.map((gId) => ({
          userId,
          permissionGroupId: gId,
          assignedBy: assignedBy || null,
        })),
      );
    }

    // Invalidate permission cache
    await this.redisService.del(`perms:${userId}`);

    this.logger.log(
      `👤 [User Groups Assigned] User ${user.fullName} assigned ${groupIds.length} groups`,
    );
    return this.getUserPermissionMatrix(companyId, userId);
  }

  /**
   * 10. Set Individual Person-Level Permission Overrides (Grants / Denies)
   */
  async setUserOverrides(
    companyId: string,
    userId: string,
    dto: SetUserOverridesDto,
    assignedBy?: string,
  ) {
    const db = this.dbService.db;

    const [user] = await db
      .select()
      .from(schema.users)
      .where(
        and(eq(schema.users.companyId, companyId), eq(schema.users.id, userId)),
      )
      .limit(1);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Clear old overrides
    await db
      .delete(schema.userPermissionOverrides)
      .where(eq(schema.userPermissionOverrides.userId, userId));

    // Insert new overrides
    if (dto.overrides && dto.overrides.length > 0) {
      await db.insert(schema.userPermissionOverrides).values(
        dto.overrides.map((ov) => ({
          userId,
          permissionId: ov.permissionId,
          granted: ov.granted,
          assignedBy: assignedBy || null,
        })),
      );
    }

    // Invalidate permission cache
    await this.redisService.del(`perms:${userId}`);

    this.logger.log(
      `👤 [User Overrides Updated] User ${user.fullName} updated with ${dto.overrides?.length || 0} overrides`,
    );
    return this.getUserPermissionMatrix(companyId, userId);
  }
}
