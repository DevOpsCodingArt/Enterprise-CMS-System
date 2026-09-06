import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc, and } from 'drizzle-orm';
import { DbService } from '../../db/db.service';
import * as schema from '../../db/schema';

@Injectable()
export class WorkforceService {
  constructor(private readonly dbService: DbService) {}

  // 1. Departments
  async getDepartments(companyId: string) {
    const db = this.dbService.db;
    return await db
      .select()
      .from(schema.departments)
      .where(eq(schema.departments.companyId, companyId))
      .orderBy(schema.departments.name);
  }

  async createDepartment(companyId: string, data: any) {
    const db = this.dbService.db;
    const [dept] = await db
      .insert(schema.departments)
      .values({
        companyId,
        name: data.name,
        code: data.code || `DEPT-${data.name.substring(0, 3).toUpperCase()}`,
        leadName: data.leadName || 'Unassigned',
        headcount: Number(data.headcount) || 0,
        activeTickets: Number(data.activeTickets) || 0,
        slaTargetHours: Number(data.slaTargetHours) || 4,
        color: data.color || 'blue',
      })
      .returning();

    return dept;
  }

  // 2. Shifts
  async getShifts(companyId: string) {
    const db = this.dbService.db;
    return await db
      .select()
      .from(schema.shiftRosters)
      .where(eq(schema.shiftRosters.companyId, companyId))
      .orderBy(schema.shiftRosters.shiftName);
  }

  async createShift(companyId: string, data: any) {
    const db = this.dbService.db;
    const [shift] = await db
      .insert(schema.shiftRosters)
      .values({
        companyId,
        shiftName: data.shiftName,
        timeRange: data.timeRange,
        department: data.department,
        assignedStaff: data.assignedStaff || [],
        onCallStandby: data.onCallStandby || [],
        branchName: data.branchName || 'Islamabad Core (F-10 HQ)',
      })
      .returning();

    return shift;
  }

  // 3. Attendance
  async getAttendance(companyId: string, dateStr?: string) {
    const db = this.dbService.db;
    const conditions = [eq(schema.attendanceLogs.companyId, companyId)];
    if (dateStr) {
      conditions.push(eq(schema.attendanceLogs.date, dateStr));
    }

    return await db
      .select()
      .from(schema.attendanceLogs)
      .where(and(...conditions))
      .orderBy(desc(schema.attendanceLogs.createdAt));
  }

  async clockIn(companyId: string, data: any) {
    const db = this.dbService.db;
    const today = new Date().toISOString().split('T')[0];

    const [log] = await db
      .insert(schema.attendanceLogs)
      .values({
        companyId,
        staffId: data.staffId,
        staffName: data.staffName,
        department: data.department || 'General Operations',
        date: data.date || today,
        clockIn: new Date(),
        checkInMethod: data.checkInMethod || 'biometric',
        isLate: Boolean(data.isLate),
        overtimeHours: String(data.overtimeHours || '0.00'),
        overtimeRateMultiplier: String(data.overtimeRateMultiplier || '1.50'),
        status: data.status || 'present',
      })
      .returning();

    return log;
  }

  async clockOut(companyId: string, logId: string) {
    const db = this.dbService.db;
    const [updated] = await db
      .update(schema.attendanceLogs)
      .set({ clockOut: new Date() })
      .where(
        and(
          eq(schema.attendanceLogs.id, logId),
          eq(schema.attendanceLogs.companyId, companyId),
        ),
      )
      .returning();

    if (!updated) {
      throw new NotFoundException(`Attendance log ${logId} not found.`);
    }
    return updated;
  }

  // 4. Work Order Tasks
  async getTasks(companyId: string, status?: string) {
    const db = this.dbService.db;
    const conditions = [eq(schema.workOrderTasks.companyId, companyId)];
    if (status) {
      conditions.push(eq(schema.workOrderTasks.status, status));
    }

    return await db
      .select()
      .from(schema.workOrderTasks)
      .where(and(...conditions))
      .orderBy(desc(schema.workOrderTasks.createdAt));
  }

  async updateTaskStatus(companyId: string, id: string, status: string) {
    const db = this.dbService.db;
    const [updated] = await db
      .update(schema.workOrderTasks)
      .set({ status, updatedAt: new Date() })
      .where(
        and(
          eq(schema.workOrderTasks.id, id),
          eq(schema.workOrderTasks.companyId, companyId),
        ),
      )
      .returning();

    if (!updated) {
      throw new NotFoundException(`Work order task ${id} not found.`);
    }
    return updated;
  }
}
