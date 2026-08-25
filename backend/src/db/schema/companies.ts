import { pgTable, uuid, varchar, text, boolean, integer, timestamp, time } from 'drizzle-orm/pg-core';
import { platformOwners } from './platform-owners';

export const companies = pgTable('companies', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  logoUrl: varchar('logo_url', { length: 512 }),
  faviconUrl: varchar('favicon_url', { length: 512 }),
  primaryColor: varchar('primary_color', { length: 50 }).default('#0ea5e9'),
  secondaryColor: varchar('secondary_color', { length: 50 }).default('#0284c7'),
  address: text('address'),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  website: varchar('website', { length: 255 }),
  apiKey: varchar('api_key', { length: 255 }).notNull().unique(),
  apiSecret: varchar('api_secret', { length: 255 }).notNull(),
  subscriptionPlan: varchar('subscription_plan', { length: 100 }).default('enterprise').notNull(),
  maxUsers: integer('max_users').default(100).notNull(),
  maxBranches: integer('max_branches').default(20).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  trialEndsAt: timestamp('trial_ends_at', { withTimezone: true }),
  timezone: varchar('timezone', { length: 100 }).default('Asia/Karachi').notNull(),
  defaultLanguage: varchar('default_language', { length: 10 }).default('en').notNull(),
  workingHoursStart: time('working_hours_start').default('09:00:00'),
  workingHoursEnd: time('working_hours_end').default('18:00:00'),
  workingDays: integer('working_days').array().default([1, 2, 3, 4, 5, 6]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => platformOwners.id),
});

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
