import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  date,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { companies } from './companies';

export const departments = pgTable(
  'departments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    companyId: uuid('company_id')
      .references(() => companies.id)
      .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    code: varchar('code', { length: 50 }).notNull(),
    leadName: varchar('lead_name', { length: 255 }).default('Unassigned'),
    headcount: integer('headcount').default(0).notNull(),
    activeTickets: integer('active_tickets').default(0).notNull(),
    slaTargetHours: integer('sla_target_hours').default(4).notNull(),
    color: varchar('color', { length: 50 }).default('blue').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('idx_departments_company').on(table.companyId)],
);

export const shiftRosters = pgTable(
  'shift_rosters',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    companyId: uuid('company_id')
      .references(() => companies.id)
      .notNull(),
    shiftName: varchar('shift_name', { length: 100 }).notNull(),
    timeRange: varchar('time_range', { length: 100 }).notNull(),
    department: varchar('department', { length: 100 }).notNull(),
    assignedStaff: jsonb('assigned_staff').default([]).notNull(), // array of strings (names)
    onCallStandby: jsonb('on_call_standby').default([]).notNull(),
    branchName: varchar('branch_name', { length: 255 }).default('Islamabad Core (F-10 HQ)'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('idx_shift_rosters_company').on(table.companyId)],
);

export const attendanceLogs = pgTable(
  'attendance_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    companyId: uuid('company_id')
      .references(() => companies.id)
      .notNull(),
    staffId: varchar('staff_id', { length: 100 }).notNull(),
    staffName: varchar('staff_name', { length: 255 }).notNull(),
    department: varchar('department', { length: 100 }).notNull(),
    date: date('date').notNull(),
    clockIn: timestamp('clock_in', { withTimezone: true }),
    clockOut: timestamp('clock_out', { withTimezone: true }),
    checkInMethod: varchar('check_in_method', { length: 50 }).default('biometric').notNull(),
    isLate: boolean('is_late').default(false).notNull(),
    overtimeHours: decimal('overtime_hours', { precision: 5, scale: 2 }).default('0.00').notNull(),
    overtimeRateMultiplier: decimal('overtime_rate_multiplier', { precision: 4, scale: 2 }).default('1.50').notNull(),
    status: varchar('status', { length: 50 }).default('present').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_attendance_company').on(table.companyId),
    index('idx_attendance_staff').on(table.companyId, table.staffId),
    index('idx_attendance_date').on(table.companyId, table.date),
  ],
);

export const workOrderTasks = pgTable(
  'work_order_tasks',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    companyId: uuid('company_id')
      .references(() => companies.id)
      .notNull(),
    taskNo: varchar('task_no', { length: 50 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    type: varchar('type', { length: 100 }).notNull(),
    subscriberCode: varchar('subscriber_code', { length: 50 }),
    subscriberName: varchar('subscriber_name', { length: 255 }),
    address: text('address'),
    priority: varchar('priority', { length: 50 }).default('Normal').notNull(),
    assignedTo: varchar('assigned_to', { length: 255 }).default('Unassigned'),
    vanNo: varchar('van_no', { length: 100 }).default('VAN-01'),
    status: varchar('status', { length: 50 }).default('todo').notNull(), // todo, assigned, en_route, in_progress, completed
    dueAt: timestamp('due_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_work_orders_company').on(table.companyId),
    index('idx_work_orders_status').on(table.companyId, table.status),
  ],
);

export type Department = typeof departments.$inferSelect;
export type ShiftRosterEntity = typeof shiftRosters.$inferSelect;
export type AttendanceLog = typeof attendanceLogs.$inferSelect;
export type WorkOrderTaskEntity = typeof workOrderTasks.$inferSelect;
