import {
  pgTable,
  uuid,
  varchar,
  integer,
  decimal,
  boolean,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { companies } from './companies';

export const packages = pgTable(
  'packages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    companyId: uuid('company_id')
      .references(() => companies.id)
      .notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    code: varchar('code', { length: 50 }),
    speedDownMbps: integer('speed_down_mbps').notNull(),
    speedUpMbps: integer('speed_up_mbps').notNull(),
    contentionRatio: varchar('contention_ratio', { length: 50 }).default('1:4 Shared').notNull(),
    pricePkrMonthly: decimal('price_pkr_monthly', { precision: 10, scale: 2 }).notNull(),
    ipPool: varchar('ip_pool', { length: 100 }).default('pool_residential_dhcp').notNull(),
    activeSubscribers: integer('active_subscribers').default(0).notNull(),
    isPopular: boolean('is_popular').default(false).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('idx_packages_company_id').on(table.companyId),
    index('idx_packages_active').on(table.companyId, table.isActive),
  ],
);

export type Package = typeof packages.$inferSelect;
export type NewPackage = typeof packages.$inferInsert;
