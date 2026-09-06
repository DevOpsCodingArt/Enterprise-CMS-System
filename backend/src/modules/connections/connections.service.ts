import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc, and } from 'drizzle-orm';
import { DbService } from '../../db/db.service';
import * as schema from '../../db/schema';

@Injectable()
export class ConnectionsService {
  constructor(private readonly dbService: DbService) {}

  async listLeads(companyId: string, stage?: string) {
    const db = this.dbService.db;
    const query = db
      .select()
      .from(schema.connectionLeads)
      .where(
        stage
          ? and(
              eq(schema.connectionLeads.companyId, companyId),
              eq(schema.connectionLeads.stage, stage),
            )
          : eq(schema.connectionLeads.companyId, companyId),
      )
      .orderBy(desc(schema.connectionLeads.createdAt));

    return await query;
  }

  async getLeadById(companyId: string, id: string) {
    const db = this.dbService.db;
    const [lead] = await db
      .select()
      .from(schema.connectionLeads)
      .where(eq(schema.connectionLeads.id, id))
      .limit(1);

    if (!lead || lead.companyId !== companyId) {
      throw new NotFoundException(`Lead ${id} not found.`);
    }
    return lead;
  }

  async createLead(companyId: string, data: any) {
    const db = this.dbService.db;
    const leadNo = data.leadNo || `LD-${Math.floor(1000 + Math.random() * 9000)}`;

    const [created] = await db
      .insert(schema.connectionLeads)
      .values({
        companyId,
        branchId: data.branchId || null,
        leadNo,
        applicantName: data.applicantName,
        fatherName: data.fatherName || null,
        phone: data.phone,
        cnic: data.cnic || null,
        address: data.address,
        branchName: data.branchName || 'Islamabad Core (F-10 HQ)',
        selectedPackage: data.selectedPackage,
        connectionType: data.connectionType || 'GPON Fiber',
        deviceModel: data.deviceModel || 'Huawei HG8245H',
        macAddress: data.macAddress || null,
        fiberDistanceMeters: Number(data.fiberDistanceMeters) || 120,
        stage: data.stage || 'inquiry',
        status: data.status || 'Pending',
        fatBoxNearest: data.fatBoxNearest || 'FAT-10/2-04',
        portAvailable: data.portAvailable !== undefined ? Boolean(data.portAvailable) : true,
        otcPkr: String(data.otcPkr || '5000.00'),
        monthlyBillPkr: String(data.monthlyBillPkr || '3500.00'),
        otcPaidPkr: String(data.otcPaidPkr || '0.00'),
        monthlyBillPaidPkr: String(data.monthlyBillPaidPkr || '0.00'),
        assignedVan: data.assignedVan || null,
        assignedBy: data.assignedBy || 'Sales Agent',
        remarks: data.remarks || null,
        opticalSignalDbm: data.opticalSignalDbm || null,
      })
      .returning();

    return created;
  }

  async updateLead(companyId: string, id: string, data: any) {
    const db = this.dbService.db;
    await this.getLeadById(companyId, id);

    const updatePayload: Record<string, any> = { updatedAt: new Date() };
    const fields = [
      'stage',
      'status',
      'applicantName',
      'phone',
      'cnic',
      'address',
      'selectedPackage',
      'connectionType',
      'deviceModel',
      'macAddress',
      'assignedVan',
      'assignedBy',
      'remarks',
      'opticalSignalDbm',
      'otcPaidPkr',
      'monthlyBillPaidPkr',
      'portAvailable',
      'fatBoxNearest',
    ];

    for (const f of fields) {
      if (data[f] !== undefined) {
        updatePayload[f] = data[f];
      }
    }

    const [updated] = await db
      .update(schema.connectionLeads)
      .set(updatePayload)
      .where(eq(schema.connectionLeads.id, id))
      .returning();

    return updated;
  }
}
