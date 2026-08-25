import { pgTable, uuid, varchar, text, decimal, timestamp, date, pgEnum } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { branches } from './branches';

export const customerClassEnum = pgEnum('customer_class', ['residential', 'business', 'corporate', 'government', 'vip']);
export const customerStatusEnum = pgEnum('customer_status', ['active', 'inactive', 'suspended', 'disconnected']);

export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  branchId: uuid('branch_id').references(() => branches.id),
  customerCode: varchar('customer_code', { length: 50 }).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  cnic: varchar('cnic', { length: 50 }),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }).notNull(),
  altPhone: varchar('alt_phone', { length: 50 }),
  username: varchar('username', { length: 100 }), // PPPoE / Radius username
  passwordHash: varchar('password_hash', { length: 255 }),
  address: text('address'),
  area: varchar('area', { length: 255 }),
  city: varchar('city', { length: 100 }).default('Islamabad'),
  latitude: decimal('latitude', { precision: 10, scale: 8 }),
  longitude: decimal('longitude', { precision: 11, scale: 8 }),
  customerClass: customerClassEnum('customer_class').default('residential').notNull(),
  packageId: varchar('package_id', { length: 100 }),
  packageName: varchar('package_name', { length: 255 }).default('50 Mbps Unlimited Fiber'),
  packageSpeed: varchar('package_speed', { length: 50 }).default('50 Mbps'),
  monthlyBilling: decimal('monthly_billing', { precision: 10, scale: 2 }).default('3500.00'),
  billingExpiryDate: date('billing_expiry_date'),
  pppoeStatus: varchar('pppoe_status', { length: 50 }).default('online'),
  currentIp: varchar('current_ip', { length: 50 }).default('192.168.10.45'),
  macAddress: varchar('mac_address', { length: 50 }),
  onuSignalDbm: decimal('onu_signal_dbm', { precision: 5, scale: 2 }).default('-19.50'),
  oltPonPort: varchar('olt_pon_port', { length: 50 }).default('EPON0/1:4'),
  status: customerStatusEnum('status').default('active').notNull(),
  registrationDate: date('registration_date'),
  activationDate: date('activation_date'),
  notes: text('notes'),
  avatarUrl: varchar('avatar_url', { length: 512 }),
  languagePreference: varchar('language_preference', { length: 10 }).default('en').notNull(),
  fcmToken: text('fcm_token'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
