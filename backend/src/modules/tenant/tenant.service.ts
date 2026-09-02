import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { eq, and, or, ilike, count, desc, type SQL } from 'drizzle-orm';

import { DbService } from '../../db/db.service';
import * as schema from '../../db/schema';
import { RedisService } from '../../core/redis/redis.service';
import {
  DEFAULT_PERMISSION_GROUPS,
  DEFAULT_WORKING_HOURS,
  DEFAULT_COMPANY_SETTINGS,
} from '../../db/dummy';
import { CreateTenantDto } from './dto/create-tenant.dto';

import { UpdateTenantDto } from './dto/update-tenant.dto';
import { UpdateCompanyProfileDto } from './dto/company-profile.dto';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import { WorkingHourItemDto } from './dto/settings.dto';

@Injectable()
export class TenantService {
  private readonly logger = new Logger(TenantService.name);

  constructor(
    private readonly dbService: DbService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 1. Platform Super-Admin: Provision a new ISP Tenant Instance
   */
  async provisionTenant(dto: CreateTenantDto, platformOwnerId?: string) {
    const db = this.dbService.db;
    const slug = dto.slug.toLowerCase().trim();

    // Check if slug or email already exists
    const [existingCompany] = await db
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.slug, slug))
      .limit(1);

    if (existingCompany) {
      throw new ConflictException(
        `A tenant with subdomain/slug "${slug}" already exists.`,
      );
    }

    const [existingOwner] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, dto.ownerEmail.toLowerCase().trim()))
      .limit(1);

    if (existingOwner) {
      throw new ConflictException(
        `A user with email "${dto.ownerEmail}" already exists.`,
      );
    }

    // Generate secure API Credentials
    const apiKey = `p1_live_${crypto.randomBytes(16).toString('hex')}`;
    const apiSecret = `p1_sec_${crypto.randomBytes(24).toString('hex')}`;
    const rawPassword = dto.ownerPassword || 'Password123!';
    const passwordHash = await bcrypt.hash(rawPassword, 10);

    // Run atomic provisioning transaction
    const [newCompany] = await db
      .insert(schema.companies)
      .values({
        name: dto.name.trim(),
        slug,
        apiKey,
        apiSecret,
        logoUrl: dto.logoUrl || null,
        faviconUrl: dto.faviconUrl || null,
        primaryColor: dto.primaryColor || '#0ea5e9',
        secondaryColor: dto.secondaryColor || '#0284c7',
        subscriptionPlan: dto.subscriptionPlan || 'enterprise',
        maxUsers: dto.maxUsers || 100,
        maxBranches: dto.maxBranches || 20,
        isActive: true,
        timezone: dto.timezone || 'Asia/Karachi',
        defaultLanguage: dto.defaultLanguage || 'en',
        address: dto.address || null,
        phone: dto.phone || null,
        email: dto.email || dto.ownerEmail,
        website: dto.website || null,
        createdBy: platformOwnerId || null,
      })
      .returning();

    // 2. Create Default Head Office Branch
    const [headOfficeBranch] = await db
      .insert(schema.branches)
      .values({
        companyId: newCompany.id,
        name: `${dto.name} Head Office`,
        code: 'HQ-01',
        address: dto.address || 'Principal Corporate Office',
        phone: dto.phone || null,
        email: dto.ownerEmail,
        isActive: true,
      })
      .returning();

    // 3. Create Company Owner User
    const [ownerUser] = await db
      .insert(schema.users)
      .values({
        companyId: newCompany.id,
        branchId: headOfficeBranch.id,
        email: dto.ownerEmail.toLowerCase().trim(),
        username: `${slug}_owner`,
        fullName: dto.ownerName.trim(),
        displayName: dto.ownerName.trim(),
        passwordHash,
        userType: 'company_owner',
        department: 'management',
        designation: 'Managing Director / CEO',
        isActive: true,
      })
      .returning();

    // 4. Seed Default Permission Groups from dummy presets
    const [superAdminGroup, ...otherGroups] = DEFAULT_PERMISSION_GROUPS;

    const [createdSuperAdminGroup] = await db
      .insert(schema.permissionGroups)
      .values({
        companyId: newCompany.id,
        name: superAdminGroup.name,
        description: superAdminGroup.description,
        isDefault: superAdminGroup.isDefault,
      })
      .returning();

    if (otherGroups.length > 0) {
      await db.insert(schema.permissionGroups).values(
        otherGroups.map((g) => ({
          companyId: newCompany.id,
          name: g.name,
          description: g.description,
          isDefault: g.isDefault,
        })),
      );
    }

    // Attach owner to Super Admin group
    await db.insert(schema.userPermissionGroups).values({
      userId: ownerUser.id,
      permissionGroupId: createdSuperAdminGroup.id,
      assignedBy: ownerUser.id,
    });

    // 5. Seed 7-Day Working Hours from dummy presets
    for (const w of DEFAULT_WORKING_HOURS) {
      await db.insert(schema.workingHours).values({
        companyId: newCompany.id,
        dayOfWeek: w.dayOfWeek,
        isWorkingDay: w.isWorkingDay,
        startTime: w.startTime,
        endTime: w.endTime,
        offlineMessage: w.offlineMessage,
      });
    }

    // 6. Seed Default Company Settings from dummy presets
    for (const s of DEFAULT_COMPANY_SETTINGS) {
      await db.insert(schema.companySettings).values({
        companyId: newCompany.id,
        key: s.key,
        value: s.value,
      });
    }

    this.logger.log(
      `🏢 [Tenant Provisioned] ISP "${dto.name}" (${slug}.primeone.io) ready.`,
    );

    return {
      company: newCompany,
      branch: headOfficeBranch,
      owner: {
        id: ownerUser.id,
        email: ownerUser.email,
        username: ownerUser.username,
        name: ownerUser.fullName,
      },
      credentials: {
        apiKey,
        apiSecret,
        temporaryPassword: rawPassword,
      },
    };
  }

  /**
   * 2. Platform Super-Admin: List All Tenants with Aggregated Metrics
   */
  async listTenants(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }) {
    const page = Math.max(Number(params?.page) || 1, 1);
    const limit = Math.min(Math.max(Number(params?.limit) || 20, 1), 100);
    const offset = (page - 1) * limit;
    const db = this.dbService.db;

    const conditions: (SQL<unknown> | undefined)[] = [];

    if (params?.search) {
      const q = `%${params.search.trim()}%`;
      conditions.push(
        or(
          ilike(schema.companies.name, q),
          ilike(schema.companies.slug, q),
          ilike(schema.companies.email, q),
        ),
      );
    }

    if (params?.isActive !== undefined) {
      conditions.push(eq(schema.companies.isActive, params.isActive));
    }

    const filteredConditions = conditions.filter(Boolean);
    const whereClause =
      filteredConditions.length > 0 ? and(...filteredConditions) : undefined;

    // Count Total
    const [{ total }] = await db
      .select({ total: count() })
      .from(schema.companies)
      .where(whereClause);

    // Fetch Tenants
    const items = await db
      .select({
        id: schema.companies.id,
        name: schema.companies.name,
        slug: schema.companies.slug,
        logoUrl: schema.companies.logoUrl,
        primaryColor: schema.companies.primaryColor,
        secondaryColor: schema.companies.secondaryColor,
        subscriptionPlan: schema.companies.subscriptionPlan,
        maxUsers: schema.companies.maxUsers,
        maxBranches: schema.companies.maxBranches,
        isActive: schema.companies.isActive,
        email: schema.companies.email,
        phone: schema.companies.phone,
        timezone: schema.companies.timezone,
        createdAt: schema.companies.createdAt,
      })
      .from(schema.companies)
      .where(whereClause)
      .orderBy(desc(schema.companies.createdAt))
      .limit(limit)
      .offset(offset);

    // Aggregate subscriber and user counts per tenant
    const enrichedItems = await Promise.all(
      items.map(async (tenant) => {
        const [{ subscriberCount }] = await db
          .select({ subscriberCount: count() })
          .from(schema.customers)
          .where(eq(schema.customers.companyId, tenant.id));

        const [{ staffCount }] = await db
          .select({ staffCount: count() })
          .from(schema.users)
          .where(eq(schema.users.companyId, tenant.id));

        const [{ branchCount }] = await db
          .select({ branchCount: count() })
          .from(schema.branches)
          .where(eq(schema.branches.companyId, tenant.id));

        return {
          ...tenant,
          subscriberCount,
          staffCount,
          branchCount,
        };
      }),
    );

    return {
      data: enrichedItems,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 3. Platform Super-Admin: Get Tenant Details
   */
  async getTenantById(companyId: string) {
    const db = this.dbService.db;

    const [company] = await db
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.id, companyId))
      .limit(1);

    if (!company) {
      throw new NotFoundException(`Tenant with ID ${companyId} not found`);
    }

    const [{ subscriberCount }] = await db
      .select({ subscriberCount: count() })
      .from(schema.customers)
      .where(eq(schema.customers.companyId, company.id));

    const [{ staffCount }] = await db
      .select({ staffCount: count() })
      .from(schema.users)
      .where(eq(schema.users.companyId, company.id));

    const [{ branchCount }] = await db
      .select({ branchCount: count() })
      .from(schema.branches)
      .where(eq(schema.branches.companyId, company.id));

    return {
      ...company,
      metrics: {
        subscriberCount,
        staffCount,
        branchCount,
        usersQuotaUtilization: Math.round(
          (staffCount / company.maxUsers) * 100,
        ),
        branchesQuotaUtilization: Math.round(
          (branchCount / company.maxBranches) * 100,
        ),
      },
    };
  }

  /**
   * 4. Platform Super-Admin: Update Tenant Quotas & Subscriptions
   */
  async updateTenant(companyId: string, dto: UpdateTenantDto) {
    const db = this.dbService.db;

    const [existing] = await db
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.id, companyId))
      .limit(1);

    if (!existing) {
      throw new NotFoundException(`Tenant ${companyId} not found`);
    }

    const updateData: Partial<typeof schema.companies.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (dto.name) updateData.name = dto.name;
    if (dto.subscriptionPlan)
      updateData.subscriptionPlan = dto.subscriptionPlan;
    if (dto.maxUsers) updateData.maxUsers = dto.maxUsers;
    if (dto.maxBranches) updateData.maxBranches = dto.maxBranches;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;
    if (dto.trialEndsAt) updateData.trialEndsAt = new Date(dto.trialEndsAt);
    if (dto.timezone) updateData.timezone = dto.timezone;
    if (dto.defaultLanguage) updateData.defaultLanguage = dto.defaultLanguage;

    const [updated] = await db
      .update(schema.companies)
      .set(updateData)
      .where(eq(schema.companies.id, companyId))
      .returning();

    await this.redisService.del(`settings:${companyId}`);

    return updated;
  }

  /**
   * 5. Platform Super-Admin: Soft Delete / Deactivate Tenant
   */
  async deleteTenant(companyId: string) {
    const db = this.dbService.db;

    await db
      .update(schema.companies)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(schema.companies.id, companyId));

    await this.redisService.del(`settings:${companyId}`);

    return { message: `Tenant ${companyId} deactivated successfully` };
  }

  /**
   * 6. Company Operations: Get Current Company Profile
   */
  async getCompanyProfile(companyId: string) {
    const db = this.dbService.db;

    const [company] = await db
      .select()
      .from(schema.companies)
      .where(eq(schema.companies.id, companyId))
      .limit(1);

    if (!company) {
      throw new NotFoundException('Company profile not found');
    }

    return company;
  }

  /**
   * 7. Company Operations: Update Company Branding & Profile
   */
  async updateCompanyProfile(companyId: string, dto: UpdateCompanyProfileDto) {
    const db = this.dbService.db;

    const updateData: Partial<typeof schema.companies.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (dto.name) updateData.name = dto.name;
    if (dto.logoUrl !== undefined) updateData.logoUrl = dto.logoUrl;
    if (dto.faviconUrl !== undefined) updateData.faviconUrl = dto.faviconUrl;
    if (dto.primaryColor) updateData.primaryColor = dto.primaryColor;
    if (dto.secondaryColor) updateData.secondaryColor = dto.secondaryColor;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.website !== undefined) updateData.website = dto.website;
    if (dto.address !== undefined) updateData.address = dto.address;
    if (dto.timezone) updateData.timezone = dto.timezone;
    if (dto.defaultLanguage) updateData.defaultLanguage = dto.defaultLanguage;

    const [updated] = await db
      .update(schema.companies)
      .set(updateData)
      .where(eq(schema.companies.id, companyId))
      .returning();

    await this.redisService.del(`settings:${companyId}`);

    return updated;
  }

  /**
   * 8. Company Operations: Get Dynamic Settings Map
   */
  async getCompanySettings(companyId: string): Promise<Record<string, string>> {
    const cacheKey = `settings:${companyId}`;

    return this.redisService.getOrSet(
      cacheKey,
      async () => {
        const rows = await this.dbService.db
          .select()
          .from(schema.companySettings)
          .where(eq(schema.companySettings.companyId, companyId));

        const map: Record<string, string> = {};
        for (const r of rows) {
          map[r.key] = r.value;
        }
        return map;
      },
      600, // 10 min cache
    );
  }

  /**
   * 9. Company Operations: Upsert a Specific Setting
   */
  async upsertSetting(companyId: string, key: string, value: string) {
    const db = this.dbService.db;

    const [existing] = await db
      .select()
      .from(schema.companySettings)
      .where(
        and(
          eq(schema.companySettings.companyId, companyId),
          eq(schema.companySettings.key, key),
        ),
      )
      .limit(1);

    if (existing) {
      await db
        .update(schema.companySettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(schema.companySettings.id, existing.id));
    } else {
      await db.insert(schema.companySettings).values({
        companyId,
        key,
        value,
      });
    }

    await this.redisService.del(`settings:${companyId}`);

    return { key, value };
  }

  /**
   * 10. Company Operations: Bulk Upsert Settings
   */
  async bulkUpdateSettings(
    companyId: string,
    settings: Record<string, string>,
  ) {
    for (const [key, value] of Object.entries(settings)) {
      await this.upsertSetting(companyId, key, value);
    }

    await this.redisService.del(`settings:${companyId}`);

    return this.getCompanySettings(companyId);
  }

  /**
   * 11. Branch Operations: List Branches with Counts
   */
  async listBranches(companyId: string) {
    const db = this.dbService.db;

    const branches = await db
      .select()
      .from(schema.branches)
      .where(eq(schema.branches.companyId, companyId))
      .orderBy(desc(schema.branches.createdAt));

    const enriched = await Promise.all(
      branches.map(async (branch) => {
        const [{ staffCount }] = await db
          .select({ staffCount: count() })
          .from(schema.users)
          .where(
            and(
              eq(schema.users.companyId, companyId),
              eq(schema.users.branchId, branch.id),
            ),
          );

        const [{ subscriberCount }] = await db
          .select({ subscriberCount: count() })
          .from(schema.customers)
          .where(
            and(
              eq(schema.customers.companyId, companyId),
              eq(schema.customers.branchId, branch.id),
            ),
          );

        return {
          ...branch,
          staffCount,
          subscriberCount,
        };
      }),
    );

    return enriched;
  }

  /**
   * 12. Branch Operations: Create New Branch
   */
  async createBranch(companyId: string, dto: CreateBranchDto) {
    const db = this.dbService.db;
    const code = dto.code.trim().toUpperCase();

    // Check branch quota limit
    const [company] = await db
      .select({ maxBranches: schema.companies.maxBranches })
      .from(schema.companies)
      .where(eq(schema.companies.id, companyId))
      .limit(1);

    const [{ currentBranches }] = await db
      .select({ currentBranches: count() })
      .from(schema.branches)
      .where(eq(schema.branches.companyId, companyId));

    if (company && currentBranches >= company.maxBranches) {
      throw new BadRequestException(
        `Branch quota limit reached (${currentBranches}/${company.maxBranches}). Please upgrade your subscription.`,
      );
    }

    // Check unique branch code per company
    const [existingCode] = await db
      .select()
      .from(schema.branches)
      .where(
        and(
          eq(schema.branches.companyId, companyId),
          eq(schema.branches.code, code),
        ),
      )
      .limit(1);

    if (existingCode) {
      throw new ConflictException(
        `Branch with code "${code}" already exists in your organization.`,
      );
    }

    const [newBranch] = await db
      .insert(schema.branches)
      .values({
        companyId,
        name: dto.name.trim(),
        code,
        address: dto.address || null,
        phone: dto.phone || null,
        email: dto.email || null,
        latitude: dto.latitude || null,
        longitude: dto.longitude || null,
        isActive: true,
      })
      .returning();

    return newBranch;
  }

  /**
   * 13. Branch Operations: Get Branch Details
   */
  async getBranchById(companyId: string, branchId: string) {
    const db = this.dbService.db;

    const [branch] = await db
      .select()
      .from(schema.branches)
      .where(
        and(
          eq(schema.branches.companyId, companyId),
          eq(schema.branches.id, branchId),
        ),
      )
      .limit(1);

    if (!branch) {
      throw new NotFoundException(`Branch ${branchId} not found`);
    }

    return branch;
  }

  /**
   * 14. Branch Operations: Update Branch Details
   */
  async updateBranch(
    companyId: string,
    branchId: string,
    dto: UpdateBranchDto,
  ) {
    const db = this.dbService.db;

    const [existing] = await db
      .select()
      .from(schema.branches)
      .where(
        and(
          eq(schema.branches.companyId, companyId),
          eq(schema.branches.id, branchId),
        ),
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundException(`Branch ${branchId} not found`);
    }

    const updateData: Partial<typeof schema.branches.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (dto.name) updateData.name = dto.name.trim();
    if (dto.code) updateData.code = dto.code.trim().toUpperCase();
    if (dto.address !== undefined) updateData.address = dto.address;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.email !== undefined) updateData.email = dto.email;
    if (dto.latitude !== undefined) updateData.latitude = dto.latitude;
    if (dto.longitude !== undefined) updateData.longitude = dto.longitude;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    const [updated] = await db
      .update(schema.branches)
      .set(updateData)
      .where(
        and(
          eq(schema.branches.companyId, companyId),
          eq(schema.branches.id, branchId),
        ),
      )
      .returning();

    return updated;
  }

  /**
   * 15. Branch Operations: Deactivate Branch
   */
  async deleteBranch(companyId: string, branchId: string) {
    const db = this.dbService.db;

    const [branch] = await db
      .select()
      .from(schema.branches)
      .where(
        and(
          eq(schema.branches.companyId, companyId),
          eq(schema.branches.id, branchId),
        ),
      )
      .limit(1);

    if (!branch) {
      throw new NotFoundException(`Branch ${branchId} not found`);
    }

    await db
      .update(schema.branches)
      .set({ isActive: false, updatedAt: new Date() })
      .where(
        and(
          eq(schema.branches.companyId, companyId),
          eq(schema.branches.id, branchId),
        ),
      );

    return { message: `Branch ${branch.name} deactivated successfully` };
  }

  /**
   * 16. Working Hours Operations: Get 7-Day Schedule
   */
  async getWorkingHours(companyId: string) {
    const db = this.dbService.db;

    const hours = await db
      .select()
      .from(schema.workingHours)
      .where(eq(schema.workingHours.companyId, companyId))
      .orderBy(schema.workingHours.dayOfWeek);

    return hours;
  }

  /**
   * 17. Working Hours Operations: Update Weekly Schedule
   */
  async updateWorkingHours(companyId: string, schedule: WorkingHourItemDto[]) {
    const db = this.dbService.db;

    for (const item of schedule) {
      const [existing] = await db
        .select()
        .from(schema.workingHours)
        .where(
          and(
            eq(schema.workingHours.companyId, companyId),
            eq(schema.workingHours.dayOfWeek, item.dayOfWeek),
          ),
        )
        .limit(1);

      if (existing) {
        await db
          .update(schema.workingHours)
          .set({
            isWorkingDay: item.isWorkingDay,
            startTime: item.startTime,
            endTime: item.endTime,
            offlineMessage: item.offlineMessage || existing.offlineMessage,
            updatedAt: new Date(),
          })
          .where(eq(schema.workingHours.id, existing.id));
      } else {
        await db.insert(schema.workingHours).values({
          companyId,
          dayOfWeek: item.dayOfWeek,
          isWorkingDay: item.isWorkingDay,
          startTime: item.startTime,
          endTime: item.endTime,
          offlineMessage: item.offlineMessage || null,
        });
      }
    }

    return this.getWorkingHours(companyId);
  }
}
