import { pgTable, uuid, varchar, text, decimal, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { customers } from './customers';
import { branches } from './branches';
import { users } from './users';
import { conversations } from './chat';

export const ticketStatusEnum = pgEnum('ticket_status', ['open', 'assigned', 'in_progress', 'pending_field', 'resolved', 'closed', 'cancelled']);
export const ticketPriorityEnum = pgEnum('ticket_priority', ['low', 'normal', 'high', 'urgent']);
export const ticketCategoryEnum = pgEnum('ticket_category', [
  'fiber_break',
  'onu_failure',
  'router_config',
  'wire_damage',
  'slow_speed',
  'new_installation',
  'relocation',
  'billing_inquiry',
  'recharge_verification',
  'other',
]);

export const tickets = pgTable('tickets', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  ticketNumber: varchar('ticket_number', { length: 50 }).notNull(), // e.g. TKT-2026-0001
  customerId: uuid('customer_id').references(() => customers.id).notNull(),
  conversationId: uuid('conversation_id').references(() => conversations.id),
  branchId: uuid('branch_id').references(() => branches.id),
  category: ticketCategoryEnum('category').default('fiber_break').notNull(),
  priority: ticketPriorityEnum('priority').default('normal').notNull(),
  status: ticketStatusEnum('status').default('open').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  assignedDepartment: varchar('assigned_department', { length: 100 }).default('field_team'), // field_team, noc, wireless, config
  assignedTo: uuid('assigned_to').references(() => users.id),
  createdBy: uuid('created_by').references(() => users.id),
  ettr: timestamp('ettr', { withTimezone: true }), // Estimated time to resolve
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  resolvedBy: uuid('resolved_by').references(() => users.id),
  resolutionNotes: text('resolution_notes'),
  resolutionOutcome: varchar('resolution_outcome', { length: 255 }),
  materialUsed: text('material_used'), // e.g. '150m Drop cable, 1x SC Fast Connector'
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  attachments: jsonb('attachments').default([]).notNull(), // URLs to evidence photos
  metadata: jsonb('metadata').default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const ticketActivities = pgTable('ticket_activities', {
  id: uuid('id').defaultRandom().primaryKey(),
  ticketId: uuid('ticket_id').references(() => tickets.id, { onDelete: 'cascade' }).notNull(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  userId: uuid('user_id').references(() => users.id),
  activityType: varchar('activity_type', { length: 100 }).notNull(), // status_changed, assigned, note_added, resolved
  comment: text('comment'),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
export type TicketActivity = typeof ticketActivities.$inferSelect;
