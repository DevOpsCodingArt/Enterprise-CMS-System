CREATE TYPE "public"."ticket_scope" AS ENUM('subscriber', 'main_line', 'backbone', 'node_outage');--> statement-breakpoint
ALTER TYPE "public"."ticket_category" ADD VALUE 'main_line_break' BEFORE 'onu_failure';--> statement-breakpoint
ALTER TYPE "public"."ticket_category" ADD VALUE 'backbone_cut' BEFORE 'onu_failure';--> statement-breakpoint
ALTER TYPE "public"."ticket_category" ADD VALUE 'olt_card_failure' BEFORE 'billing_inquiry';--> statement-breakpoint
ALTER TYPE "public"."ticket_category" ADD VALUE 'core_switch_fault' BEFORE 'billing_inquiry';--> statement-breakpoint
ALTER TYPE "public"."ticket_category" ADD VALUE 'power_outage' BEFORE 'billing_inquiry';--> statement-breakpoint
ALTER TABLE "tickets" ALTER COLUMN "customer_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tickets" ALTER COLUMN "assigned_department" SET DEFAULT 'field_operations';--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "ticket_scope" "ticket_scope" DEFAULT 'subscriber' NOT NULL;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "area_affected" varchar(255);--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "affected_subscribers_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "olt_pon_port" varchar(100);--> statement-breakpoint
CREATE INDEX "idx_tickets_scope" ON "tickets" USING btree ("company_id","ticket_scope");