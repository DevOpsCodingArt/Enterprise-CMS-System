import { pgTable, uuid, varchar, text, boolean, integer, timestamp, jsonb, time, pgEnum } from 'drizzle-orm/pg-core';
import { companies } from './companies';
import { customers } from './customers';
import { users } from './users';

export const conversationInitiatorEnum = pgEnum('conversation_initiator', ['customer', 'staff']);
export const conversationStatusEnum = pgEnum('conversation_status', ['waiting', 'active', 'on_hold', 'closed']);
export const conversationPriorityEnum = pgEnum('conversation_priority', ['low', 'normal', 'high', 'urgent']);
export const messageSenderTypeEnum = pgEnum('message_sender_type', ['customer', 'staff', 'system']);
export const messageTypeEnum = pgEnum('message_type', ['text', 'image', 'voice', 'video', 'document', 'system', 'ticket_created', 'payment_proof']);
export const messageStatusEnum = pgEnum('message_status', ['sent', 'delivered', 'read']);

export const conversations = pgTable('conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  customerId: uuid('customer_id').references(() => customers.id).notNull(),
  initiatedBy: conversationInitiatorEnum('initiated_by').default('customer').notNull(),
  status: conversationStatusEnum('status').default('waiting').notNull(),
  assignedTo: uuid('assigned_to').references(() => users.id),
  assignedAt: timestamp('assigned_at', { withTimezone: true }),
  previousAssignee: uuid('previous_assignee').references(() => users.id),
  priority: conversationPriorityEnum('priority').default('normal').notNull(),
  subject: varchar('subject', { length: 255 }),
  closureReason: varchar('closure_reason', { length: 255 }),
  closureOutcome: text('closure_outcome'),
  closedBy: uuid('closed_by').references(() => users.id),
  closedAt: timestamp('closed_at', { withTimezone: true }),
  customerRating: integer('customer_rating'), // 1 to 5
  customerFeedback: text('customer_feedback'),
  lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
  lastCustomerMessageAt: timestamp('last_customer_message_at', { withTimezone: true }),
  lastStaffMessageAt: timestamp('last_staff_message_at', { withTimezone: true }),
  unreadCountCustomer: integer('unread_count_customer').default(0).notNull(),
  unreadCountStaff: integer('unread_count_staff').default(0).notNull(),
  metadata: jsonb('metadata').default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').references(() => conversations.id, { onDelete: 'cascade' }).notNull(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  senderType: messageSenderTypeEnum('sender_type').notNull(),
  senderCustomerId: uuid('sender_customer_id').references(() => customers.id),
  senderUserId: uuid('sender_user_id').references(() => users.id),
  senderName: varchar('sender_name', { length: 255 }),
  messageType: messageTypeEnum('message_type').default('text').notNull(),
  content: text('content'),
  fileUrl: varchar('file_url', { length: 512 }),
  fileName: varchar('file_name', { length: 255 }),
  fileSize: integer('file_size'),
  fileMimeType: varchar('file_mime_type', { length: 100 }),
  thumbnailUrl: varchar('thumbnail_url', { length: 512 }),
  duration: integer('duration'), // seconds for audio/video
  replyToMessageId: uuid('reply_to_message_id'),
  isInternalNote: boolean('is_internal_note').default(false).notNull(),
  isPublicNote: boolean('is_public_note').default(false).notNull(),
  status: messageStatusEnum('status').default('sent').notNull(),
  deliveredAt: timestamp('delivered_at', { withTimezone: true }),
  readAt: timestamp('read_at', { withTimezone: true }),
  isDeleted: boolean('is_deleted').default(false).notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  deletedBy: uuid('deleted_by').references(() => users.id),
  metadata: jsonb('metadata').default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const chatTransfers = pgTable('chat_transfers', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').references(() => conversations.id, { onDelete: 'cascade' }).notNull(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  fromUserId: uuid('from_user_id').references(() => users.id).notNull(),
  toUserId: uuid('to_user_id').references(() => users.id).notNull(),
  reason: text('reason').notNull(),
  transferredAt: timestamp('transferred_at', { withTimezone: true }).defaultNow().notNull(),
});

export const quickReplies = pgTable('quick_replies', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  title: varchar('title', { length: 100 }).notNull(),
  content: text('content').notNull(),
  shortcut: varchar('shortcut', { length: 50 }), // e.g. /greeting, /restart
  category: varchar('category', { length: 100 }),
  createdBy: uuid('created_by').references(() => users.id).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const workingHours = pgTable('working_hours', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id').references(() => companies.id).notNull(),
  dayOfWeek: integer('day_of_week').notNull(), // 0=Mon, 6=Sun
  isWorkingDay: boolean('is_working_day').default(true).notNull(),
  startTime: time('start_time').notNull(),
  endTime: time('end_time').notNull(),
  offlineMessage: text('offline_message'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type ChatTransfer = typeof chatTransfers.$inferSelect;
export type QuickReply = typeof quickReplies.$inferSelect;
export type WorkingHour = typeof workingHours.$inferSelect;
