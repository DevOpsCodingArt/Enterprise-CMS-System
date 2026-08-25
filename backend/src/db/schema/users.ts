import { pgTable, uuid, varchar, boolean, timestamp, text, pgEnum } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { branches } from './branches';

export const userTypeEnum = pgEnum('user_type', ['company_owner', 'staff']);
export const languageEnum = pgEnum('language_preference', ['en', 'ur']);

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  branchId: uuid('branch_id').references(() => branches.id),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  username: varchar('username', { length: 100 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  displayName: varchar('display_name', { length: 100 }),
  avatarUrl: varchar('avatar_url', { length: 512 }),
  userType: userTypeEnum('user_type').default('staff').notNull(),
  department: varchar('department', { length: 100 }).default('helpdesk'), // helpdesk, noc, field, accounts, hr
  designation: varchar('designation', { length: 100 }).default('Support Officer'),
  isActive: boolean('is_active').default(true).notNull(),
  isOnline: boolean('is_online').default(false).notNull(),
  lastSeenAt: timestamp('last_seen_at', { withTimezone: true }),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  languagePreference: languageEnum('language_preference').default('en').notNull(),
  fcmToken: text('fcm_token'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
