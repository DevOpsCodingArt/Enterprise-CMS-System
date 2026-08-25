import { pgTable, uuid, varchar, text, boolean, integer, timestamp } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { users } from './users';

export const permissionCategories = pgTable('permission_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').references(() => companies.id), // NULL implies system default
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull(),
  description: text('description'),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const permissions = pgTable('permissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  categoryId: uuid('category_id').references(() => permissionCategories.id).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(), // e.g. 'chat.view', 'chat.transfer'
  description: text('description'),
  isSystem: boolean('is_system').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const permissionGroups = pgTable('permission_groups', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const permissionGroupPermissions = pgTable('permission_group_permissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  permissionGroupId: uuid('permission_group_id').references(() => permissionGroups.id, { onDelete: 'cascade' }).notNull(),
  permissionId: uuid('permission_id').references(() => permissions.id, { onDelete: 'cascade' }).notNull(),
  granted: boolean('granted').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const userPermissionGroups = pgTable('user_permission_groups', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  permissionGroupId: uuid('permission_group_id').references(() => permissionGroups.id, { onDelete: 'cascade' }).notNull(),
  assignedBy: uuid('assigned_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const userPermissionOverrides = pgTable('user_permission_overrides', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  permissionId: uuid('permission_id').references(() => permissions.id, { onDelete: 'cascade' }).notNull(),
  granted: boolean('granted').notNull(),
  assignedBy: uuid('assigned_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type PermissionCategory = typeof permissionCategories.$inferSelect;
export type Permission = typeof permissions.$inferSelect;
export type PermissionGroup = typeof permissionGroups.$inferSelect;
export type UserPermissionGroup = typeof userPermissionGroups.$inferSelect;
export type UserPermissionOverride = typeof userPermissionOverrides.$inferSelect;
