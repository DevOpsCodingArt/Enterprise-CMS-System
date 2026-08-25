-- Prime One Database Initialization Script
-- Enables UUID generation and PostGIS extensions for ISP network mapping

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Default configuration for Row-Level Security tenant context variable
-- (e.g. app.current_company_id)
DO $$
BEGIN
   RAISE NOTICE 'Prime One PostgreSQL + PostGIS extensions initialized successfully.';
END
$$;
