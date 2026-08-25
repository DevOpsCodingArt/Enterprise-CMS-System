import { pgTable, uuid, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';

export const platformOwners = pgTable('platform_owners', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type PlatformOwner = typeof platformOwners.$inferSelect;
export type NewPlatformOwner = typeof platformOwners.$inferInsert;
