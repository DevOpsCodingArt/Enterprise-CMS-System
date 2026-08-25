import { pgTable, uuid, varchar, text, boolean, decimal, timestamp } from 'drizzle-orm/pg-core';
import { companies } from './companies';

export const branches = pgTable('branches', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }).notNull(),
  address: text('address'),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Branch = typeof branches.$inferSelect;
export type NewBranch = typeof branches.$inferInsert;
