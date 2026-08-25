import { pgTable, uuid, varchar, text, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { users } from './users';
import { customers } from './customers';

export const actorTypeEnum = pgEnum('actor_type', ['platform_owner', 'user', 'customer', 'system']);
export const loginTypeEnum = pgEnum('login_type', ['password', 'otp', 'refresh_token']);
export const loginStatusEnum = pgEnum('login_status', ['success', 'failed']);

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').references(() => companies.id),
  actorType: actorTypeEnum('actor_type').notNull(),
  actorId: uuid('actor_id').notNull(),
  actorName: varchar('actor_name', { length: 255 }),
  action: varchar('action', { length: 100 }).notNull(), // e.g. 'chat.transfer', 'user.create', 'ticket.resolve'
  entityType: varchar('entity_type', { length: 100 }).notNull(), // e.g. 'conversation', 'user', 'ticket'
  entityId: uuid('entity_id').notNull(),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const loginHistory = pgTable('login_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  customerId: uuid('customer_id').references(() => customers.id),
  companyId: uuid('company_id').references(() => companies.id),
  loginType: loginTypeEnum('login_type').default('password').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  deviceInfo: text('device_info'),
  status: loginStatusEnum('status').default('success').notNull(),
  failureReason: text('failure_reason'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const companySettings = pgTable('company_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  key: varchar('key', { length: 100 }).notNull(), // e.g. 'max_concurrent_chats', 'auto_assign_enabled', 'sla_response_minutes'
  value: text('value').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type LoginHistory = typeof loginHistory.$inferSelect;
export type CompanySetting = typeof companySettings.$inferSelect;
