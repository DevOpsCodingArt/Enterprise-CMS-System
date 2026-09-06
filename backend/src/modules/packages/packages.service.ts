import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { DbService } from '../../db/db.service';
import * as schema from '../../db/schema';

@Injectable()
export class PackagesService {
  constructor(private readonly dbService: DbService) {}

  async listPackages(companyId: string) {
    const db = this.dbService.db;
    return await db
      .select()
      .from(schema.packages)
      .where(eq(schema.packages.companyId, companyId))
      .orderBy(desc(schema.packages.createdAt));
  }

  async getPackageById(companyId: string, id: string) {
    const db = this.dbService.db;
    const [pkg] = await db
      .select()
      .from(schema.packages)
      .where(eq(schema.packages.id, id))
      .limit(1);

    if (!pkg || pkg.companyId !== companyId) {
      throw new NotFoundException(`Tariff package ${id} not found.`);
    }
    return pkg;
  }

  async createPackage(companyId: string, data: any) {
    const db = this.dbService.db;
    const [created] = await db
      .insert(schema.packages)
      .values({
        companyId,
        name: data.name,
        code: data.code || `PKG-${data.speedDownMbps}M`,
        speedDownMbps: Number(data.speedDownMbps) || 50,
        speedUpMbps: Number(data.speedUpMbps) || 50,
        contentionRatio: data.contentionRatio || '1:4 Shared',
        pricePkrMonthly: String(data.pricePkrMonthly || '3500.00'),
        ipPool: data.ipPool || 'pool_residential_dhcp',
        activeSubscribers: Number(data.activeSubscribers) || 0,
        isPopular: Boolean(data.isPopular),
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      })
      .returning();

    return created;
  }

  async updatePackage(companyId: string, id: string, data: any) {
    const db = this.dbService.db;
    await this.getPackageById(companyId, id);

    const updatePayload: Record<string, any> = { updatedAt: new Date() };
    if (data.name !== undefined) updatePayload.name = data.name;
    if (data.code !== undefined) updatePayload.code = data.code;
    if (data.speedDownMbps !== undefined) updatePayload.speedDownMbps = Number(data.speedDownMbps);
    if (data.speedUpMbps !== undefined) updatePayload.speedUpMbps = Number(data.speedUpMbps);
    if (data.contentionRatio !== undefined) updatePayload.contentionRatio = data.contentionRatio;
    if (data.pricePkrMonthly !== undefined) updatePayload.pricePkrMonthly = String(data.pricePkrMonthly);
    if (data.ipPool !== undefined) updatePayload.ipPool = data.ipPool;
    if (data.isPopular !== undefined) updatePayload.isPopular = Boolean(data.isPopular);
    if (data.isActive !== undefined) updatePayload.isActive = Boolean(data.isActive);

    const [updated] = await db
      .update(schema.packages)
      .set(updatePayload)
      .where(eq(schema.packages.id, id))
      .returning();

    return updated;
  }

  async deletePackage(companyId: string, id: string) {
    const db = this.dbService.db;
    await this.getPackageById(companyId, id);

    await db
      .update(schema.packages)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(schema.packages.id, id));

    return { success: true, message: `Package ${id} deactivated.` };
  }
}
