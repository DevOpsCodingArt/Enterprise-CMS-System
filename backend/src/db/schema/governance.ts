import {
  pgTable,
  uuid,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { companies } from './companies';

export const slaRules = pgTable(
  'sla_rules',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    companyId: uuid('company_id')
      .references(() => companies.id)
      .notNull(),
    priority: varchar('priority', { length: 50 }).notNull(), // Critical, High, Normal, Low
    targetFirstResponseMins: integer('target_first_response_mins').notNull(),
    targetResolutionHours: integer('target_resolution_hours').notNull(),
    autoEscalateAfterMins: integer('auto_escalate_after_mins').notNull(),
    escalateToRole: varchar('escalate_to_role', { length: 100 }).notNull(),
    notifyChannels: jsonb('notify_channels').default([]).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_sla_rules_company').on(table.companyId),
    index('idx_sla_rules_priority').on(table.companyId, table.priority),
  ],
);

export type SlaRuleEntity = typeof slaRules.$inferSelect;
export type NewSlaRule = typeof slaRules.$inferInsert;
