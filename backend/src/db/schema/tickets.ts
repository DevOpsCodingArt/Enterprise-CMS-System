import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  integer,
  timestamp,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { customers } from './customers';
import { branches } from './branches';
import { users } from './users';
import { conversations } from './chat';

export const ticketStatusEnum = pgEnum('ticket_status', [
  'open',
  'assigned',
  'in_progress',
  'pending_field',
  'resolved',
  'closed',
  'cancelled',
]);

export const ticketPriorityEnum = pgEnum('ticket_priority', [
  'low',
  'normal',
  'high',
  'urgent',
]);

export const ticketScopeEnum = pgEnum('ticket_scope', [
  'subscriber',
  'main_line',
  'backbone',
  'pon_network',
  'node_outage',
]);

export const ticketCategoryEnum = pgEnum('ticket_category', [
  'fiber_break',
  'main_line_break',
  'backbone_cut',
  'two_way_issue',
  'pon_shifting',
  'macro_bend',
  'rogue_onu_isolation',
  'splitter_fault',
  'joint_closure_damage',
  'onu_failure',
  'router_config',
  'wire_damage',
  'slow_speed',
  'new_installation',
  'relocation',
  'olt_card_failure',
  'core_switch_fault',
  'power_outage',
  'billing_inquiry',
  'recharge_verification',
  'other',
]);

export const tickets = pgTable(
  'tickets',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    companyId: uuid('company_id')
      .references(() => companies.id)
      .notNull(),
    ticketNumber: varchar('ticket_number', { length: 50 }).notNull(), // Industry Standard: e.g. INC-260902-0042
    ticketScope: ticketScopeEnum('ticket_scope')
      .default('subscriber')
      .notNull(),
    customerId: uuid('customer_id').references(() => customers.id), // Nullable for Main Line / PON Shifting / Area Outages
    conversationId: uuid('conversation_id').references(() => conversations.id),
    branchId: uuid('branch_id').references(() => branches.id),
    category: ticketCategoryEnum('category').default('fiber_break').notNull(),
    priority: ticketPriorityEnum('priority').default('normal').notNull(),
    status: ticketStatusEnum('status').default('open').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    assignedDepartment: varchar('assigned_department', { length: 100 }).default(
      'field_operations',
    ), // main_line_splicing, field_operations, noc_core, wireless_rf, config, billing
    assignedTo: uuid('assigned_to').references(() => users.id),
    createdBy: uuid('created_by').references(() => users.id),

    // Telecom Infrastructure & Main Line Fault Fields
    areaAffected: varchar('area_affected', { length: 255 }),
    affectedSubscribersCount: integer('affected_subscribers_count').default(0),
    oltPonPort: varchar('olt_pon_port', { length: 100 }), // Current / Impacted PON
    sourcePonPort: varchar('source_pon_port', { length: 100 }), // For PON Shifting
    destinationPonPort: varchar('destination_pon_port', { length: 100 }), // For PON Shifting
    splitterId: varchar('splitter_id', { length: 100 }), // e.g. 'F-10/2-FAT-04'
    coreCountAffected: integer('core_count_affected'), // e.g. 24, 48, 96, 144
    cableType: varchar('cable_type', { length: 100 }), // Underground Armored, Aerial ADSS, Drop
    otdrBreakDistanceMeters: decimal('otdr_break_distance_meters', {
      precision: 10,
      scale: 2,
    }), // e.g. 1420.50m
    opticalFaultType: varchar('optical_fault_type', { length: 100 }), // two_way_discrepancy, macro_bend, high_reflectance, rogue_onu

    ettr: timestamp('ettr', { withTimezone: true }), // Estimated time to resolve
    resolvedAt: timestamp('resolved_at', { withTimezone: true }),
    resolvedBy: uuid('resolved_by').references(() => users.id),
    resolutionNotes: text('resolution_notes'),
    resolutionOutcome: varchar('resolution_outcome', { length: 255 }),
    materialUsed: text('material_used'), // e.g. '96-Core Fiber Joint Closure, 4x Heat Shrink Sleeves'
    latitude: decimal('latitude', { precision: 10, scale: 8 }),
    longitude: decimal('longitude', { precision: 11, scale: 8 }),
    attachments: jsonb('attachments').default([]).notNull(), // URLs to evidence photos / OTDR graphs
    metadata: jsonb('metadata').default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('idx_tickets_company_id').on(table.companyId),
    index('idx_tickets_company_status').on(table.companyId, table.status),
    index('idx_tickets_priority').on(
      table.companyId,
      table.priority,
      table.status,
    ),
    index('idx_tickets_assigned').on(table.assignedTo, table.status),
    index('idx_tickets_customer').on(table.customerId),
    index('idx_tickets_scope').on(table.companyId, table.ticketScope),
    index('idx_tickets_branch').on(table.companyId, table.branchId),
    uniqueIndex('idx_tickets_number').on(table.companyId, table.ticketNumber),
    index('idx_tickets_ettr').on(table.companyId, table.ettr),
  ],
);

export const ticketActivities = pgTable(
  'ticket_activities',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    ticketId: uuid('ticket_id')
      .references(() => tickets.id, { onDelete: 'cascade' })
      .notNull(),
    companyId: uuid('company_id')
      .references(() => companies.id)
      .notNull(),
    userId: uuid('user_id').references(() => users.id),
    activityType: varchar('activity_type', { length: 100 }).notNull(), // created, status_changed, assigned, otdr_test, pon_shifted, note_added, resolved, closed
    comment: text('comment'),
    oldValues: jsonb('old_values'),
    newValues: jsonb('new_values'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('idx_ticket_activities_ticket').on(table.ticketId, table.createdAt),
    index('idx_ticket_activities_company').on(table.companyId),
  ],
);

export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;
export type TicketActivity = typeof ticketActivities.$inferSelect;
