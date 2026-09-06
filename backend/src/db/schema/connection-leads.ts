import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { branches } from './branches';

export const connectionLeads = pgTable(
  'connection_leads',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    companyId: uuid('company_id')
      .references(() => companies.id)
      .notNull(),
    branchId: uuid('branch_id').references(() => branches.id),
    leadNo: varchar('lead_no', { length: 50 }).notNull(),
    applicantName: varchar('applicant_name', { length: 255 }).notNull(),
    fatherName: varchar('father_name', { length: 255 }),
    phone: varchar('50', { length: 50 }).notNull(),
    cnic: varchar('cnic', { length: 50 }),
    address: text('address').notNull(),
    branchName: varchar('branch_name', { length: 255 }).default('Islamabad Core (F-10 HQ)'),
    selectedPackage: varchar('selected_package', { length: 255 }).notNull(),
    connectionType: varchar('connection_type', { length: 50 }).default('GPON Fiber'),
    deviceModel: varchar('device_model', { length: 100 }).default('Huawei HG8245H'),
    macAddress: varchar('mac_address', { length: 50 }),
    fiberDistanceMeters: integer('fiber_distance_meters').default(120),
    stage: varchar('stage', { length: 50 }).default('inquiry').notNull(), // inquiry, feasibility_passed, deposit_paid, installation_scheduled, activated, cancelled
    status: varchar('status', { length: 50 }).default('Pending').notNull(),
    fatBoxNearest: varchar('fat_box_nearest', { length: 100 }).default('FAT-10/2-04'),
    portAvailable: boolean('port_available').default(true).notNull(),
    otcPkr: decimal('otc_pkr', { precision: 10, scale: 2 }).default('5000.00').notNull(),
    monthlyBillPkr: decimal('monthly_bill_pkr', { precision: 10, scale: 2 }).default('3500.00').notNull(),
    otcPaidPkr: decimal('otc_paid_pkr', { precision: 10, scale: 2 }).default('0.00').notNull(),
    monthlyBillPaidPkr: decimal('monthly_bill_paid_pkr', { precision: 10, scale: 2 }).default('0.00').notNull(),
    assignedVan: varchar('assigned_van', { length: 100 }),
    assignedBy: varchar('assigned_by', { length: 255 }),
    remarks: text('remarks'),
    opticalSignalDbm: varchar('optical_signal_dbm', { length: 50 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_connection_leads_company').on(table.companyId),
    index('idx_connection_leads_stage').on(table.companyId, table.stage),
    index('idx_connection_leads_status').on(table.companyId, table.status),
  ],
);

export type ConnectionLead = typeof connectionLeads.$inferSelect;
export type NewConnectionLead = typeof connectionLeads.$inferInsert;
