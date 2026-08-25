import { pgTable, uuid, varchar, text, boolean, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { users } from './users';
import { customers } from './customers';

export const recipientTypeEnum = pgEnum('recipient_type', ['user', 'customer']);
export const notificationTypeEnum = pgEnum('notification_type', ['chat_message', 'chat_assigned', 'chat_transferred', 'ticket_assigned', 'ticket_updated', 'payment_verified', 'system', 'announcement']);
export const notificationSentViaEnum = pgEnum('notification_sent_via', ['push', 'in_app', 'email']);
export const otpTypeEnum = pgEnum('otp_type', ['registration', 'login', 'password_reset']);

export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').references(() => companies.id), // NULL for platform-wide
  recipientType: recipientTypeEnum('recipient_type').notNull(),
  recipientUserId: uuid('recipient_user_id').references(() => users.id),
  recipientCustomerId: uuid('recipient_customer_id').references(() => customers.id),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  body: text('body').notNull(),
  data: jsonb('data'),
  isRead: boolean('is_read').default(false).notNull(),
  readAt: timestamp('read_at', { withTimezone: true }),
  sentVia: notificationSentViaEnum('sent_via').default('in_app').notNull(),
  fcmMessageId: varchar('fcm_message_id', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const emailOtps = pgTable('email_otps', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  otpCode: varchar('otp_code', { length: 10 }).notNull(),
  otpType: otpTypeEnum('otp_type').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  isUsed: boolean('is_used').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const refreshTokens = pgTable('refresh_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  customerId: uuid('customer_id').references(() => customers.id),
  tokenHash: varchar('token_hash', { length: 255 }).notNull(),
  deviceInfo: text('device_info'),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  isRevoked: boolean('is_revoked').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type EmailOtp = typeof emailOtps.$inferSelect;
export type RefreshToken = typeof refreshTokens.$inferSelect;
