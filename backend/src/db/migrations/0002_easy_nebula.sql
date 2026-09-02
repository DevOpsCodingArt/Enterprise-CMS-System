ALTER TYPE "public"."ticket_category" ADD VALUE 'two_way_issue' BEFORE 'onu_failure';--> statement-breakpoint
ALTER TYPE "public"."ticket_category" ADD VALUE 'pon_shifting' BEFORE 'onu_failure';--> statement-breakpoint
ALTER TYPE "public"."ticket_category" ADD VALUE 'macro_bend' BEFORE 'onu_failure';--> statement-breakpoint
ALTER TYPE "public"."ticket_category" ADD VALUE 'rogue_onu_isolation' BEFORE 'onu_failure';--> statement-breakpoint
ALTER TYPE "public"."ticket_category" ADD VALUE 'splitter_fault' BEFORE 'onu_failure';--> statement-breakpoint
ALTER TYPE "public"."ticket_category" ADD VALUE 'joint_closure_damage' BEFORE 'onu_failure';--> statement-breakpoint
ALTER TYPE "public"."ticket_scope" ADD VALUE 'pon_network' BEFORE 'node_outage';--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "source_pon_port" varchar(100);--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "destination_pon_port" varchar(100);--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "splitter_id" varchar(100);--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "core_count_affected" integer;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "cable_type" varchar(100);--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "otdr_break_distance_meters" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "optical_fault_type" varchar(100);