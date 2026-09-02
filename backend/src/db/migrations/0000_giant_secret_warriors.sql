CREATE TYPE "public"."language_preference" AS ENUM('en', 'ur');--> statement-breakpoint
CREATE TYPE "public"."user_type" AS ENUM('company_owner', 'staff');--> statement-breakpoint
CREATE TYPE "public"."customer_class" AS ENUM('residential', 'business', 'corporate', 'government', 'vip');--> statement-breakpoint
CREATE TYPE "public"."customer_status" AS ENUM('active', 'inactive', 'suspended', 'disconnected');--> statement-breakpoint
CREATE TYPE "public"."conversation_initiator" AS ENUM('customer', 'staff');--> statement-breakpoint
CREATE TYPE "public"."conversation_priority" AS ENUM('low', 'normal', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."conversation_status" AS ENUM('waiting', 'active', 'on_hold', 'closed');--> statement-breakpoint
CREATE TYPE "public"."message_sender_type" AS ENUM('customer', 'staff', 'system');--> statement-breakpoint
CREATE TYPE "public"."message_status" AS ENUM('sent', 'delivered', 'read');--> statement-breakpoint
CREATE TYPE "public"."message_type" AS ENUM('text', 'image', 'voice', 'video', 'document', 'system', 'ticket_created', 'payment_proof');--> statement-breakpoint
CREATE TYPE "public"."ticket_category" AS ENUM('fiber_break', 'onu_failure', 'router_config', 'wire_damage', 'slow_speed', 'new_installation', 'relocation', 'billing_inquiry', 'recharge_verification', 'other');--> statement-breakpoint
CREATE TYPE "public"."ticket_priority" AS ENUM('low', 'normal', 'high', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."ticket_status" AS ENUM('open', 'assigned', 'in_progress', 'pending_field', 'resolved', 'closed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."notification_sent_via" AS ENUM('push', 'in_app', 'email');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('chat_message', 'chat_assigned', 'chat_transferred', 'ticket_assigned', 'ticket_updated', 'payment_verified', 'system', 'announcement');--> statement-breakpoint
CREATE TYPE "public"."otp_type" AS ENUM('registration', 'login', 'password_reset');--> statement-breakpoint
CREATE TYPE "public"."recipient_type" AS ENUM('user', 'customer');--> statement-breakpoint
CREATE TYPE "public"."actor_type" AS ENUM('platform_owner', 'user', 'customer', 'system');--> statement-breakpoint
CREATE TYPE "public"."login_status" AS ENUM('success', 'failed');--> statement-breakpoint
CREATE TYPE "public"."login_type" AS ENUM('password', 'otp', 'refresh_token');--> statement-breakpoint
CREATE TABLE "platform_owners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "platform_owners_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"logo_url" varchar(512),
	"favicon_url" varchar(512),
	"primary_color" varchar(50) DEFAULT '#0ea5e9',
	"secondary_color" varchar(50) DEFAULT '#0284c7',
	"address" text,
	"phone" varchar(50),
	"email" varchar(255),
	"website" varchar(255),
	"api_key" varchar(255) NOT NULL,
	"api_secret" varchar(255) NOT NULL,
	"subscription_plan" varchar(100) DEFAULT 'enterprise' NOT NULL,
	"max_users" integer DEFAULT 100 NOT NULL,
	"max_branches" integer DEFAULT 20 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"trial_ends_at" timestamp with time zone,
	"timezone" varchar(100) DEFAULT 'Asia/Karachi' NOT NULL,
	"default_language" varchar(10) DEFAULT 'en' NOT NULL,
	"working_hours_start" time DEFAULT '09:00:00',
	"working_hours_end" time DEFAULT '18:00:00',
	"working_days" integer[] DEFAULT '{1,2,3,4,5,6}',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid,
	CONSTRAINT "companies_slug_unique" UNIQUE("slug"),
	CONSTRAINT "companies_api_key_unique" UNIQUE("api_key")
);
--> statement-breakpoint
CREATE TABLE "branches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(50) NOT NULL,
	"address" text,
	"phone" varchar(50),
	"email" varchar(255),
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"username" varchar(100) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"display_name" varchar(100),
	"avatar_url" varchar(512),
	"user_type" "user_type" DEFAULT 'staff' NOT NULL,
	"department" varchar(100) DEFAULT 'helpdesk',
	"designation" varchar(100) DEFAULT 'Support Officer',
	"is_active" boolean DEFAULT true NOT NULL,
	"is_online" boolean DEFAULT false NOT NULL,
	"last_seen_at" timestamp with time zone,
	"last_login_at" timestamp with time zone,
	"language_preference" "language_preference" DEFAULT 'en' NOT NULL,
	"fcm_token" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid,
	"customer_code" varchar(50) NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"cnic" varchar(50),
	"email" varchar(255),
	"phone" varchar(50) NOT NULL,
	"alt_phone" varchar(50),
	"username" varchar(100),
	"password_hash" varchar(255),
	"address" text,
	"area" varchar(255),
	"city" varchar(100) DEFAULT 'Islamabad',
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"customer_class" "customer_class" DEFAULT 'residential' NOT NULL,
	"package_id" varchar(100),
	"package_name" varchar(255) DEFAULT '50 Mbps Unlimited Fiber',
	"package_speed" varchar(50) DEFAULT '50 Mbps',
	"monthly_billing" numeric(10, 2) DEFAULT '3500.00',
	"billing_expiry_date" date,
	"pppoe_status" varchar(50) DEFAULT 'online',
	"current_ip" varchar(50) DEFAULT '192.168.10.45',
	"mac_address" varchar(50),
	"onu_signal_dbm" numeric(5, 2) DEFAULT '-19.50',
	"olt_pon_port" varchar(50) DEFAULT 'EPON0/1:4',
	"status" "customer_status" DEFAULT 'active' NOT NULL,
	"registration_date" date,
	"activation_date" date,
	"notes" text,
	"avatar_url" varchar(512),
	"language_preference" varchar(10) DEFAULT 'en' NOT NULL,
	"fcm_token" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permission_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permission_group_permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"permission_group_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"granted" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permission_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"description" text,
	"is_system" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "permissions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "user_permission_groups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"permission_group_id" uuid NOT NULL,
	"assigned_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_permission_overrides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"permission_id" uuid NOT NULL,
	"granted" boolean NOT NULL,
	"assigned_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"from_user_id" uuid NOT NULL,
	"to_user_id" uuid NOT NULL,
	"reason" text NOT NULL,
	"transferred_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"customer_id" uuid NOT NULL,
	"initiated_by" "conversation_initiator" DEFAULT 'customer' NOT NULL,
	"status" "conversation_status" DEFAULT 'waiting' NOT NULL,
	"assigned_to" uuid,
	"assigned_at" timestamp with time zone,
	"previous_assignee" uuid,
	"priority" "conversation_priority" DEFAULT 'normal' NOT NULL,
	"subject" varchar(255),
	"closure_reason" varchar(255),
	"closure_outcome" text,
	"closed_by" uuid,
	"closed_at" timestamp with time zone,
	"customer_rating" integer,
	"customer_feedback" text,
	"last_message_at" timestamp with time zone,
	"last_customer_message_at" timestamp with time zone,
	"last_staff_message_at" timestamp with time zone,
	"unread_count_customer" integer DEFAULT 0 NOT NULL,
	"unread_count_staff" integer DEFAULT 0 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"sender_type" "message_sender_type" NOT NULL,
	"sender_customer_id" uuid,
	"sender_user_id" uuid,
	"sender_name" varchar(255),
	"message_type" "message_type" DEFAULT 'text' NOT NULL,
	"content" text,
	"file_url" varchar(512),
	"file_name" varchar(255),
	"file_size" integer,
	"file_mime_type" varchar(100),
	"thumbnail_url" varchar(512),
	"duration" integer,
	"reply_to_message_id" uuid,
	"is_internal_note" boolean DEFAULT false NOT NULL,
	"is_public_note" boolean DEFAULT false NOT NULL,
	"status" "message_status" DEFAULT 'sent' NOT NULL,
	"delivered_at" timestamp with time zone,
	"read_at" timestamp with time zone,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"deleted_by" uuid,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quick_replies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"title" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"shortcut" varchar(50),
	"category" varchar(100),
	"created_by" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "working_hours" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"day_of_week" integer NOT NULL,
	"is_working_day" boolean DEFAULT true NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"offline_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticket_activities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ticket_id" uuid NOT NULL,
	"company_id" uuid NOT NULL,
	"user_id" uuid,
	"activity_type" varchar(100) NOT NULL,
	"comment" text,
	"old_values" jsonb,
	"new_values" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"ticket_number" varchar(50) NOT NULL,
	"customer_id" uuid NOT NULL,
	"conversation_id" uuid,
	"branch_id" uuid,
	"category" "ticket_category" DEFAULT 'fiber_break' NOT NULL,
	"priority" "ticket_priority" DEFAULT 'normal' NOT NULL,
	"status" "ticket_status" DEFAULT 'open' NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"assigned_department" varchar(100) DEFAULT 'field_team',
	"assigned_to" uuid,
	"created_by" uuid,
	"ettr" timestamp with time zone,
	"resolved_at" timestamp with time zone,
	"resolved_by" uuid,
	"resolution_notes" text,
	"resolution_outcome" varchar(255),
	"material_used" text,
	"latitude" numeric(10, 8),
	"longitude" numeric(11, 8),
	"attachments" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_otps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"otp_code" varchar(10) NOT NULL,
	"otp_type" "otp_type" NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"is_used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid,
	"recipient_type" "recipient_type" NOT NULL,
	"recipient_user_id" uuid,
	"recipient_customer_id" uuid,
	"type" "notification_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"data" jsonb,
	"is_read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp with time zone,
	"sent_via" "notification_sent_via" DEFAULT 'in_app' NOT NULL,
	"fcm_message_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"customer_id" uuid,
	"token_hash" varchar(255) NOT NULL,
	"device_info" text,
	"expires_at" timestamp with time zone NOT NULL,
	"is_revoked" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid,
	"actor_type" "actor_type" NOT NULL,
	"actor_id" uuid NOT NULL,
	"actor_name" varchar(255),
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" uuid NOT NULL,
	"old_values" jsonb,
	"new_values" jsonb,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"key" varchar(100) NOT NULL,
	"value" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "login_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"customer_id" uuid,
	"company_id" uuid,
	"login_type" "login_type" DEFAULT 'password' NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"device_info" text,
	"status" "login_status" DEFAULT 'success' NOT NULL,
	"failure_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_created_by_platform_owners_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."platform_owners"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "branches" ADD CONSTRAINT "branches_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permission_categories" ADD CONSTRAINT "permission_categories_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permission_group_permissions" ADD CONSTRAINT "permission_group_permissions_permission_group_id_permission_groups_id_fk" FOREIGN KEY ("permission_group_id") REFERENCES "public"."permission_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permission_group_permissions" ADD CONSTRAINT "permission_group_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permission_groups" ADD CONSTRAINT "permission_groups_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_category_id_permission_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."permission_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permission_groups" ADD CONSTRAINT "user_permission_groups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permission_groups" ADD CONSTRAINT "user_permission_groups_permission_group_id_permission_groups_id_fk" FOREIGN KEY ("permission_group_id") REFERENCES "public"."permission_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permission_groups" ADD CONSTRAINT "user_permission_groups_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permission_overrides" ADD CONSTRAINT "user_permission_overrides_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permission_overrides" ADD CONSTRAINT "user_permission_overrides_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_permission_overrides" ADD CONSTRAINT "user_permission_overrides_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_transfers" ADD CONSTRAINT "chat_transfers_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_transfers" ADD CONSTRAINT "chat_transfers_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_transfers" ADD CONSTRAINT "chat_transfers_from_user_id_users_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_transfers" ADD CONSTRAINT "chat_transfers_to_user_id_users_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_previous_assignee_users_id_fk" FOREIGN KEY ("previous_assignee") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_closed_by_users_id_fk" FOREIGN KEY ("closed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_customer_id_customers_id_fk" FOREIGN KEY ("sender_customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_user_id_users_id_fk" FOREIGN KEY ("sender_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_deleted_by_users_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quick_replies" ADD CONSTRAINT "quick_replies_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quick_replies" ADD CONSTRAINT "quick_replies_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "working_hours" ADD CONSTRAINT "working_hours_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_activities" ADD CONSTRAINT "ticket_activities_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_activities" ADD CONSTRAINT "ticket_activities_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_activities" ADD CONSTRAINT "ticket_activities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_resolved_by_users_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_user_id_users_id_fk" FOREIGN KEY ("recipient_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_customer_id_customers_id_fk" FOREIGN KEY ("recipient_customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_settings" ADD CONSTRAINT "company_settings_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "login_history" ADD CONSTRAINT "login_history_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "login_history" ADD CONSTRAINT "login_history_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "login_history" ADD CONSTRAINT "login_history_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_platform_owners_email" ON "platform_owners" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_platform_owners_active" ON "platform_owners" USING btree ("is_active");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_companies_slug" ON "companies" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_companies_api_key" ON "companies" USING btree ("api_key");--> statement-breakpoint
CREATE INDEX "idx_companies_is_active" ON "companies" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_branches_company_id" ON "branches" USING btree ("company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_branches_company_code" ON "branches" USING btree ("company_id","code");--> statement-breakpoint
CREATE INDEX "idx_branches_is_active" ON "branches" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "idx_users_company_id" ON "users" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_users_branch_id" ON "users" USING btree ("branch_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_users_company_email" ON "users" USING btree ("company_id","email");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_users_company_username" ON "users" USING btree ("company_id","username");--> statement-breakpoint
CREATE INDEX "idx_users_company_dept" ON "users" USING btree ("company_id","department");--> statement-breakpoint
CREATE INDEX "idx_users_is_online" ON "users" USING btree ("is_online");--> statement-breakpoint
CREATE INDEX "idx_customers_company_id" ON "customers" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_customers_company_status" ON "customers" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX "idx_customers_company_branch" ON "customers" USING btree ("company_id","branch_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_customers_company_code" ON "customers" USING btree ("company_id","customer_code");--> statement-breakpoint
CREATE INDEX "idx_customers_phone" ON "customers" USING btree ("phone");--> statement-breakpoint
CREATE INDEX "idx_customers_cnic" ON "customers" USING btree ("cnic");--> statement-breakpoint
CREATE INDEX "idx_customers_username" ON "customers" USING btree ("username");--> statement-breakpoint
CREATE INDEX "idx_customers_email" ON "customers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_customers_billing_expiry" ON "customers" USING btree ("company_id","billing_expiry_date");--> statement-breakpoint
CREATE INDEX "idx_perm_categories_company" ON "permission_categories" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_group_perms_group" ON "permission_group_permissions" USING btree ("permission_group_id");--> statement-breakpoint
CREATE INDEX "idx_perm_groups_company" ON "permission_groups" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_permissions_category" ON "permissions" USING btree ("category_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_permissions_slug" ON "permissions" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "idx_user_groups_user" ON "user_permission_groups" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_user_overrides_user" ON "user_permission_overrides" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_transfers_conversation" ON "chat_transfers" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "idx_transfers_company" ON "chat_transfers" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_conversations_company_id" ON "conversations" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_conversations_company_status" ON "conversations" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX "idx_conversations_assigned" ON "conversations" USING btree ("assigned_to","status");--> statement-breakpoint
CREATE INDEX "idx_conversations_customer" ON "conversations" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "idx_conversations_last_msg" ON "conversations" USING btree ("company_id","last_message_at");--> statement-breakpoint
CREATE INDEX "idx_messages_conversation_id" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "idx_messages_company_id" ON "messages" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_messages_conversation_created" ON "messages" USING btree ("conversation_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_messages_status" ON "messages" USING btree ("conversation_id","status");--> statement-breakpoint
CREATE INDEX "idx_quick_replies_company" ON "quick_replies" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_quick_replies_shortcut" ON "quick_replies" USING btree ("company_id","shortcut");--> statement-breakpoint
CREATE INDEX "idx_working_hours_company" ON "working_hours" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_ticket_activities_ticket" ON "ticket_activities" USING btree ("ticket_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_ticket_activities_company" ON "ticket_activities" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_tickets_company_id" ON "tickets" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_tickets_company_status" ON "tickets" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX "idx_tickets_priority" ON "tickets" USING btree ("company_id","priority","status");--> statement-breakpoint
CREATE INDEX "idx_tickets_assigned" ON "tickets" USING btree ("assigned_to","status");--> statement-breakpoint
CREATE INDEX "idx_tickets_customer" ON "tickets" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "idx_tickets_branch" ON "tickets" USING btree ("company_id","branch_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_tickets_number" ON "tickets" USING btree ("company_id","ticket_number");--> statement-breakpoint
CREATE INDEX "idx_tickets_ettr" ON "tickets" USING btree ("company_id","ettr");--> statement-breakpoint
CREATE INDEX "idx_email_otps_email" ON "email_otps" USING btree ("email","is_used");--> statement-breakpoint
CREATE INDEX "idx_notifications_user" ON "notifications" USING btree ("recipient_user_id","is_read","created_at");--> statement-breakpoint
CREATE INDEX "idx_notifications_customer" ON "notifications" USING btree ("recipient_customer_id","is_read","created_at");--> statement-breakpoint
CREATE INDEX "idx_notifications_company" ON "notifications" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_refresh_tokens_hash" ON "refresh_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "idx_refresh_tokens_user" ON "refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_refresh_tokens_customer" ON "refresh_tokens" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "idx_audit_company_time" ON "audit_logs" USING btree ("company_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_audit_entity" ON "audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "idx_audit_actor" ON "audit_logs" USING btree ("actor_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_settings_company_key" ON "company_settings" USING btree ("company_id","key");--> statement-breakpoint
CREATE INDEX "idx_login_user" ON "login_history" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_login_customer" ON "login_history" USING btree ("customer_id","created_at");--> statement-breakpoint
CREATE INDEX "idx_login_company" ON "login_history" USING btree ("company_id","created_at");