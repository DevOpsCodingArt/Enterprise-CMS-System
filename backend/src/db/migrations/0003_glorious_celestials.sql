CREATE TABLE "packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(50),
	"speed_down_mbps" integer NOT NULL,
	"speed_up_mbps" integer NOT NULL,
	"contention_ratio" varchar(50) DEFAULT '1:4 Shared' NOT NULL,
	"price_pkr_monthly" numeric(10, 2) NOT NULL,
	"ip_pool" varchar(100) DEFAULT 'pool_residential_dhcp' NOT NULL,
	"active_subscribers" integer DEFAULT 0 NOT NULL,
	"is_popular" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "connection_leads" (
	"50" varchar(50) NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"branch_id" uuid,
	"lead_no" varchar(50) NOT NULL,
	"applicant_name" varchar(255) NOT NULL,
	"father_name" varchar(255),
	"cnic" varchar(50),
	"address" text NOT NULL,
	"branch_name" varchar(255) DEFAULT 'Islamabad Core (F-10 HQ)',
	"selected_package" varchar(255) NOT NULL,
	"connection_type" varchar(50) DEFAULT 'GPON Fiber',
	"device_model" varchar(100) DEFAULT 'Huawei HG8245H',
	"mac_address" varchar(50),
	"fiber_distance_meters" integer DEFAULT 120,
	"stage" varchar(50) DEFAULT 'inquiry' NOT NULL,
	"status" varchar(50) DEFAULT 'Pending' NOT NULL,
	"fat_box_nearest" varchar(100) DEFAULT 'FAT-10/2-04',
	"port_available" boolean DEFAULT true NOT NULL,
	"otc_pkr" numeric(10, 2) DEFAULT '5000.00' NOT NULL,
	"monthly_bill_pkr" numeric(10, 2) DEFAULT '3500.00' NOT NULL,
	"otc_paid_pkr" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"monthly_bill_paid_pkr" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"assigned_van" varchar(100),
	"assigned_by" varchar(255),
	"remarks" text,
	"optical_signal_dbm" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attendance_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"staff_id" varchar(100) NOT NULL,
	"staff_name" varchar(255) NOT NULL,
	"department" varchar(100) NOT NULL,
	"date" date NOT NULL,
	"clock_in" timestamp with time zone,
	"clock_out" timestamp with time zone,
	"check_in_method" varchar(50) DEFAULT 'biometric' NOT NULL,
	"is_late" boolean DEFAULT false NOT NULL,
	"overtime_hours" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"overtime_rate_multiplier" numeric(4, 2) DEFAULT '1.50' NOT NULL,
	"status" varchar(50) DEFAULT 'present' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(50) NOT NULL,
	"lead_name" varchar(255) DEFAULT 'Unassigned',
	"headcount" integer DEFAULT 0 NOT NULL,
	"active_tickets" integer DEFAULT 0 NOT NULL,
	"sla_target_hours" integer DEFAULT 4 NOT NULL,
	"color" varchar(50) DEFAULT 'blue' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shift_rosters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"shift_name" varchar(100) NOT NULL,
	"time_range" varchar(100) NOT NULL,
	"department" varchar(100) NOT NULL,
	"assigned_staff" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"on_call_standby" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"branch_name" varchar(255) DEFAULT 'Islamabad Core (F-10 HQ)',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "work_order_tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"task_no" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"type" varchar(100) NOT NULL,
	"subscriber_code" varchar(50),
	"subscriber_name" varchar(255),
	"address" text,
	"priority" varchar(50) DEFAULT 'Normal' NOT NULL,
	"assigned_to" varchar(255) DEFAULT 'Unassigned',
	"van_no" varchar(100) DEFAULT 'VAN-01',
	"status" varchar(50) DEFAULT 'todo' NOT NULL,
	"due_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sla_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_id" uuid NOT NULL,
	"priority" varchar(50) NOT NULL,
	"target_first_response_mins" integer NOT NULL,
	"target_resolution_hours" integer NOT NULL,
	"auto_escalate_after_mins" integer NOT NULL,
	"escalate_to_role" varchar(100) NOT NULL,
	"notify_channels" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "packages" ADD CONSTRAINT "packages_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connection_leads" ADD CONSTRAINT "connection_leads_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connection_leads" ADD CONSTRAINT "connection_leads_branch_id_branches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attendance_logs" ADD CONSTRAINT "attendance_logs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "departments_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_rosters" ADD CONSTRAINT "shift_rosters_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_order_tasks" ADD CONSTRAINT "work_order_tasks_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sla_rules" ADD CONSTRAINT "sla_rules_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_packages_company_id" ON "packages" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_packages_active" ON "packages" USING btree ("company_id","is_active");--> statement-breakpoint
CREATE INDEX "idx_connection_leads_company" ON "connection_leads" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_connection_leads_stage" ON "connection_leads" USING btree ("company_id","stage");--> statement-breakpoint
CREATE INDEX "idx_connection_leads_status" ON "connection_leads" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX "idx_attendance_company" ON "attendance_logs" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_attendance_staff" ON "attendance_logs" USING btree ("company_id","staff_id");--> statement-breakpoint
CREATE INDEX "idx_attendance_date" ON "attendance_logs" USING btree ("company_id","date");--> statement-breakpoint
CREATE INDEX "idx_departments_company" ON "departments" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_shift_rosters_company" ON "shift_rosters" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_work_orders_company" ON "work_order_tasks" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_work_orders_status" ON "work_order_tasks" USING btree ("company_id","status");--> statement-breakpoint
CREATE INDEX "idx_sla_rules_company" ON "sla_rules" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "idx_sla_rules_priority" ON "sla_rules" USING btree ("company_id","priority");