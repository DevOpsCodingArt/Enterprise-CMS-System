import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { eq, and, or, ilike, count, desc, asc, type SQL } from 'drizzle-orm';
import { DbService } from '../../db/db.service';
import * as schema from '../../db/schema';
import { RedisService } from '../../core/redis/redis.service';
import { RbacService } from '../rbac/rbac.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly dbService: DbService,
    private readonly redisService: RedisService,
    private readonly rbacService: RbacService,
  ) {}

  /**
   * 1. List Staff Directory (Paginated + Search + Filters)
   */
  async listUsers(companyId: string, query: UserQueryDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
    const offset = (page - 1) * limit;
    const db = this.dbService.db;

    const conditions: (SQL<unknown> | undefined)[] = [
      eq(schema.users.companyId, companyId),
    ];

    if (query.search) {
      const q = `%${query.search.trim()}%`;
      conditions.push(
        or(
          ilike(schema.users.fullName, q),
          ilike(schema.users.displayName, q),
          ilike(schema.users.email, q),
          ilike(schema.users.username, q),
          ilike(schema.users.phone, q),
          ilike(schema.users.department, q),
          ilike(schema.users.designation, q),
        ),
      );
    }

    if (query.department) {
      conditions.push(eq(schema.users.department, query.department));
    }

    if (query.branchId) {
      conditions.push(eq(schema.users.branchId, query.branchId));
    }

    if (query.isActive !== undefined) {
      conditions.push(eq(schema.users.isActive, query.isActive));
    }

    if (query.userType && ['company_owner', 'staff'].includes(query.userType)) {
      conditions.push(
        eq(schema.users.userType, query.userType as 'company_owner' | 'staff'),
      );
    }

    const filteredConditions = conditions.filter(Boolean);
    const whereClause = and(...filteredConditions);

    // Count Total matching
    const [{ total }] = await db
      .select({ total: count() })
      .from(schema.users)
      .where(whereClause);

    // Sorting
    const sortAsc = query.sortOrder?.toLowerCase() === 'asc';
    let sortDirection = sortAsc
      ? asc(schema.users.createdAt)
      : desc(schema.users.createdAt);

    if (query.sortBy === 'fullName') {
      sortDirection = sortAsc
        ? asc(schema.users.fullName)
        : desc(schema.users.fullName);
    } else if (query.sortBy === 'email') {
      sortDirection = sortAsc
        ? asc(schema.users.email)
        : desc(schema.users.email);
    } else if (query.sortBy === 'department') {
      sortDirection = sortAsc
        ? asc(schema.users.department)
        : desc(schema.users.department);
    } else if (query.sortBy === 'isOnline') {
      sortDirection = sortAsc
        ? asc(schema.users.isOnline)
        : desc(schema.users.isOnline);
    }

    const rawUsers = await db
      .select({
        id: schema.users.id,
        companyId: schema.users.companyId,
        branchId: schema.users.branchId,
        branchName: schema.branches.name,
        branchCode: schema.branches.code,
        email: schema.users.email,
        username: schema.users.username,
        fullName: schema.users.fullName,
        displayName: schema.users.displayName,
        phone: schema.users.phone,
        avatarUrl: schema.users.avatarUrl,
        userType: schema.users.userType,
        department: schema.users.department,
        designation: schema.users.designation,
        isActive: schema.users.isActive,
        isOnline: schema.users.isOnline,
        lastSeenAt: schema.users.lastSeenAt,
        createdAt: schema.users.createdAt,
      })
      .from(schema.users)
      .leftJoin(schema.branches, eq(schema.users.branchId, schema.branches.id))
      .where(whereClause)
      .orderBy(sortDirection)
      .limit(limit)
      .offset(offset);

    // Attach assigned groups to each user
    const items = await Promise.all(
      rawUsers.map(async (u) => {
        const userGroups = await db
          .select({
            id: schema.permissionGroups.id,
            name: schema.permissionGroups.name,
          })
          .from(schema.userPermissionGroups)
          .innerJoin(
            schema.permissionGroups,
            eq(
              schema.userPermissionGroups.permissionGroupId,
              schema.permissionGroups.id,
            ),
          )
          .where(eq(schema.userPermissionGroups.userId, u.id));

        return {
          ...u,
          groups: userGroups,
          groupNames: userGroups.map((g) => g.name),
        };
      }),
    );

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 2. Get Single User Profile
   */
  async getUserById(companyId: string, userId: string) {
    const db = this.dbService.db;

    const [user] = await db
      .select({
        id: schema.users.id,
        companyId: schema.users.companyId,
        branchId: schema.users.branchId,
        branchName: schema.branches.name,
        branchCode: schema.branches.code,
        email: schema.users.email,
        username: schema.users.username,
        fullName: schema.users.fullName,
        displayName: schema.users.displayName,
        phone: schema.users.phone,
        avatarUrl: schema.users.avatarUrl,
        userType: schema.users.userType,
        department: schema.users.department,
        designation: schema.users.designation,
        isActive: schema.users.isActive,
        isOnline: schema.users.isOnline,
        lastSeenAt: schema.users.lastSeenAt,
        createdAt: schema.users.createdAt,
        updatedAt: schema.users.updatedAt,
      })
      .from(schema.users)
      .leftJoin(schema.branches, eq(schema.users.branchId, schema.branches.id))
      .where(
        and(eq(schema.users.companyId, companyId), eq(schema.users.id, userId)),
      )
      .limit(1);

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const matrix = await this.rbacService.getUserPermissionMatrix(
      companyId,
      userId,
    );

    return {
      ...user,
      groups: matrix.assignedGroups,
      inheritedPermissions: matrix.inheritedPermissions,
      overrides: matrix.individualOverrides,
      effectivePermissions: matrix.effectivePermissions,
    };
  }

  /**
   * 3. Create / Provision Staff User
   */
  async createUser(companyId: string, dto: CreateUserDto, creatorId?: string) {
    const db = this.dbService.db;

    // Check email uniqueness within company
    const [existingEmail] = await db
      .select()
      .from(schema.users)
      .where(
        and(
          eq(schema.users.companyId, companyId),
          eq(schema.users.email, dto.email.toLowerCase().trim()),
        ),
      )
      .limit(1);

    if (existingEmail) {
      throw new ConflictException(
        `User with email ${dto.email} already exists.`,
      );
    }

    // Check username uniqueness within company
    const [existingUsername] = await db
      .select()
      .from(schema.users)
      .where(
        and(
          eq(schema.users.companyId, companyId),
          eq(schema.users.username, dto.username.toLowerCase().trim()),
        ),
      )
      .limit(1);

    if (existingUsername) {
      throw new ConflictException(`Username ${dto.username} is already taken.`);
    }

    // Hash password
    const rawPassword = dto.password || 'Password123!';
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    const [newUser] = await db
      .insert(schema.users)
      .values({
        companyId,
        branchId: dto.branchId || null,
        email: dto.email.toLowerCase().trim(),
        username: dto.username.toLowerCase().trim(),
        passwordHash,
        fullName: dto.fullName.trim(),
        displayName: dto.displayName
          ? dto.displayName.trim()
          : dto.fullName.trim(),
        phone: dto.phone ? dto.phone.trim() : null,
        department: dto.department,
        designation: dto.designation,
        userType: dto.userType || 'staff',
        isActive: true,
        isOnline: false,
      })
      .returning();

    // Assign initial permission groups if provided
    if (dto.groupIds && dto.groupIds.length > 0) {
      await db.insert(schema.userPermissionGroups).values(
        dto.groupIds.map((gId) => ({
          userId: newUser.id,
          permissionGroupId: gId,
          assignedBy: creatorId || null,
        })),
      );
    }

    // Assign initial individual overrides if provided
    if (dto.overrides && dto.overrides.length > 0) {
      await db.insert(schema.userPermissionOverrides).values(
        dto.overrides.map((ov) => ({
          userId: newUser.id,
          permissionId: ov.permissionId,
          granted: ov.granted,
          assignedBy: creatorId || null,
        })),
      );
    }

    this.logger.log(
      `👤 [Staff User Provisioned] ${newUser.fullName} (${newUser.email}) in tenant ${companyId}`,
    );
    return this.getUserById(companyId, newUser.id);
  }

  /**
   * 4. Update Staff User Profile & Role Assignments
   */
  async updateUser(companyId: string, userId: string, dto: UpdateUserDto) {
    const db = this.dbService.db;

    const [existing] = await db
      .select()
      .from(schema.users)
      .where(
        and(eq(schema.users.companyId, companyId), eq(schema.users.id, userId)),
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const updateData: Partial<typeof schema.users.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (dto.email) updateData.email = dto.email.toLowerCase().trim();
    if (dto.fullName) updateData.fullName = dto.fullName.trim();
    if (dto.displayName) updateData.displayName = dto.displayName.trim();
    if (dto.phone !== undefined)
      updateData.phone = dto.phone ? dto.phone.trim() : null;
    if (dto.department) updateData.department = dto.department;
    if (dto.designation) updateData.designation = dto.designation;
    if (dto.branchId !== undefined) updateData.branchId = dto.branchId;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.userType) updateData.userType = dto.userType;
    if (dto.avatarUrl !== undefined) updateData.avatarUrl = dto.avatarUrl;
    if (dto.password)
      updateData.passwordHash = await bcrypt.hash(dto.password, 10);

    await db
      .update(schema.users)
      .set(updateData)
      .where(
        and(eq(schema.users.companyId, companyId), eq(schema.users.id, userId)),
      );

    // Update group assignments if provided
    if (dto.groupIds !== undefined) {
      await db
        .delete(schema.userPermissionGroups)
        .where(eq(schema.userPermissionGroups.userId, userId));

      if (dto.groupIds.length > 0) {
        await db.insert(schema.userPermissionGroups).values(
          dto.groupIds.map((gId) => ({
            userId,
            permissionGroupId: gId,
          })),
        );
      }
    }

    // Invalidate Redis permissions cache
    await this.redisService.del(`perms:${userId}`);

    return this.getUserById(companyId, userId);
  }

  /**
   * 5. Deactivate / Delete Staff Account
   */
  async deleteUser(companyId: string, userId: string) {
    const db = this.dbService.db;

    await db
      .update(schema.users)
      .set({
        isActive: false,
        isOnline: false,
        updatedAt: new Date(),
      })
      .where(
        and(eq(schema.users.companyId, companyId), eq(schema.users.id, userId)),
      );

    // Revoke all refresh tokens
    await db
      .update(schema.refreshTokens)
      .set({ isRevoked: true })
      .where(eq(schema.refreshTokens.userId, userId));

    await this.redisService.del(`perms:${userId}`);

    return { message: `Staff account ${userId} deactivated successfully.` };
  }

  /**
   * 6. Reset Staff Password
   */
  async resetPassword(companyId: string, userId: string, newPassword?: string) {
    const db = this.dbService.db;

    const rawPassword = newPassword || 'Password123!';
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    await db
      .update(schema.users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(
        and(eq(schema.users.companyId, companyId), eq(schema.users.id, userId)),
      );

    // Revoke all existing sessions
    await db
      .update(schema.refreshTokens)
      .set({ isRevoked: true })
      .where(eq(schema.refreshTokens.userId, userId));

    return {
      message: 'Password reset successfully. Existing sessions revoked.',
    };
  }
}
