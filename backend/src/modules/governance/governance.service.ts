import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc } from 'drizzle-orm';
import { DbService } from '../../db/db.service';
import * as schema from '../../db/schema';

@Injectable()
export class GovernanceService {
  constructor(private readonly dbService: DbService) {}

  // 1. SLA Rules
  async getSlaRules(companyId: string) {
    const db = this.dbService.db;
    return await db
      .select()
      .from(schema.slaRules)
      .where(eq(schema.slaRules.companyId, companyId))
      .orderBy(schema.slaRules.priority);
  }

  async createSlaRule(companyId: string, data: any) {
    const db = this.dbService.db;
    const [rule] = await db
      .insert(schema.slaRules)
      .values({
        companyId,
        priority: data.priority,
        targetFirstResponseMins: Number(data.targetFirstResponseMins) || 30,
        targetResolutionHours: Number(data.targetResolutionHours) || 4,
        autoEscalateAfterMins: Number(data.autoEscalateAfterMins) || 60,
        escalateToRole: data.escalateToRole || 'Support Supervisor',
        notifyChannels: data.notifyChannels || ['Dashboard Notification'],
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      })
      .returning();

    return rule;
  }

  // 2. Canned Shortcuts (reads from schema.quickReplies)
  async getCannedShortcuts(companyId: string) {
    const db = this.dbService.db;
    return await db
      .select()
      .from(schema.quickReplies)
      .where(eq(schema.quickReplies.companyId, companyId))
      .orderBy(schema.quickReplies.displayOrder);
  }

  async createCannedShortcut(companyId: string, userId: string, data: any) {
    const db = this.dbService.db;
    const [qr] = await db
      .insert(schema.quickReplies)
      .values({
        companyId,
        createdBy: userId,
        title: data.title || data.shortcut,
        shortcut: data.shortcut,
        content: data.content || data.body,
        category: data.category || 'General',
        isActive: true,
        displayOrder: Number(data.displayOrder) || 0,
      })
      .returning();

    return qr;
  }
}
