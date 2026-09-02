# PRIME ONE — PostgreSQL Optimization & Security Guide

> **Tailored for**: Prime One Multi-Tenant ISP CMS  
> **Database**: PostgreSQL 16 + PostGIS · Drizzle ORM · postgres.js driver  
> **Last Updated**: September 2, 2026

---

## Table of Contents

1. [Strategic Indexing](#1-strategic-indexing)
2. [Multi-Tenant Query Isolation (RLS)](#2-multi-tenant-query-isolation-rls)
3. [Connection Pooling](#3-connection-pooling)
4. [Full-Text Search](#4-full-text-search-for-subscriber-crm)
5. [Query Optimization Patterns](#5-query-optimization-patterns)
6. [Caching Layer (Redis)](#6-caching-layer-redis)
7. [Write Optimization](#7-write-optimization)
8. [Table Partitioning](#8-table-partitioning)
9. [JSONB Optimization](#9-jsonb-optimization)
10. [Security Hardening](#10-security-hardening)
11. [Monitoring & Maintenance](#11-monitoring--maintenance)
12. [PostgreSQL Configuration Tuning](#12-postgresql-configuration-tuning)
13. [Backup & Recovery](#13-backup--recovery)
14. [Migration to Production](#14-migration-to-production-checklist)

---

## 1. Strategic Indexing

Your current schemas define foreign keys but **zero explicit indexes**. Every table that serves list/filter/search queries needs targeted indexes. Here's the complete index plan for each table:

### 1.1 Customers Table (CRM — Highest Query Volume)

```sql
-- Tenant isolation (EVERY query filters by company_id)
CREATE INDEX idx_customers_company_id ON customers(company_id);

-- Composite: Tenant + Status (list active subscribers per ISP)
CREATE INDEX idx_customers_company_status ON customers(company_id, status);

-- Composite: Tenant + Branch (branch-level CRM views)
CREATE INDEX idx_customers_company_branch ON customers(company_id, branch_id);

-- Search by customer code (exact lookup — used in billing, 360°)
CREATE UNIQUE INDEX idx_customers_company_code ON customers(company_id, customer_code);

-- Phone number lookup (CSR searches by customer phone)
CREATE INDEX idx_customers_phone ON customers(phone);

-- CNIC lookup (government identity search)
CREATE INDEX idx_customers_cnic ON customers(cnic) WHERE cnic IS NOT NULL;

-- PPPoE username lookup (MikroTik RADIUS mapping)
CREATE INDEX idx_customers_username ON customers(username) WHERE username IS NOT NULL;

-- Email lookup (customer portal login)
CREATE INDEX idx_customers_email ON customers(email) WHERE email IS NOT NULL;

-- Full-text search index (name + phone + CNIC + customer_code)
CREATE INDEX idx_customers_search ON customers
  USING GIN (to_tsvector('english', coalesce(full_name,'') || ' ' || coalesce(phone,'') || ' ' || coalesce(cnic,'') || ' ' || coalesce(customer_code,'')));

-- Billing expiry (find customers with expired packages)
CREATE INDEX idx_customers_billing_expiry ON customers(company_id, billing_expiry_date)
  WHERE status = 'active';

-- Created at (sorting for recent registrations)
CREATE INDEX idx_customers_created ON customers(company_id, created_at DESC);
```

### 1.2 Conversations Table (Chat — Real-Time Queries)

```sql
-- Tenant + Status (agent inbox: "show me all waiting/active chats")
CREATE INDEX idx_conversations_company_status ON conversations(company_id, status);

-- Agent assignment (my chats: "show chats assigned to me")
CREATE INDEX idx_conversations_assigned ON conversations(assigned_to, status)
  WHERE status IN ('waiting', 'active', 'on_hold');

-- Customer conversations (customer 360° view)
CREATE INDEX idx_conversations_customer ON conversations(customer_id, created_at DESC);

-- Last message ordering (inbox sorted by most recent)
CREATE INDEX idx_conversations_last_msg ON conversations(company_id, last_message_at DESC NULLS LAST)
  WHERE status != 'closed';

-- SLA monitoring (open conversations without assignment)
CREATE INDEX idx_conversations_waiting ON conversations(company_id, created_at)
  WHERE status = 'waiting';
```

### 1.3 Messages Table (Chat — Highest Row Count)

```sql
-- Conversation message history (most frequent query)
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at ASC);

-- Tenant filter (RLS performance)
CREATE INDEX idx_messages_company ON messages(company_id);

-- Unread message lookup
CREATE INDEX idx_messages_unread ON messages(conversation_id, status)
  WHERE status != 'read' AND is_deleted = false;

-- Internal notes filter (staff-only view)
CREATE INDEX idx_messages_internal ON messages(conversation_id)
  WHERE is_internal_note = true;
```

### 1.4 Tickets Table (Trouble Tickets — Kanban Views)

```sql
-- Tenant + Status (Kanban board: columns by status)
CREATE INDEX idx_tickets_company_status ON tickets(company_id, status);

-- Tenant + Priority + Status (urgent tickets dashboard)
CREATE INDEX idx_tickets_priority ON tickets(company_id, priority, status)
  WHERE status NOT IN ('closed', 'cancelled');

-- Assignment lookup (my tickets)
CREATE INDEX idx_tickets_assigned ON tickets(assigned_to, status)
  WHERE status NOT IN ('closed', 'cancelled');

-- Customer tickets (customer 360° and portal)
CREATE INDEX idx_tickets_customer ON tickets(customer_id, created_at DESC);

-- Branch-level view
CREATE INDEX idx_tickets_branch ON tickets(company_id, branch_id, status);

-- Ticket number (exact lookup, should be unique per tenant)
CREATE UNIQUE INDEX idx_tickets_number ON tickets(company_id, ticket_number);

-- SLA monitoring (open tickets approaching ETTR)
CREATE INDEX idx_tickets_ettr ON tickets(company_id, ettr)
  WHERE status IN ('open', 'assigned', 'in_progress');
```

### 1.5 Ticket Activities (Timeline)

```sql
-- Activity timeline for a ticket
CREATE INDEX idx_ticket_activities_ticket ON ticket_activities(ticket_id, created_at ASC);
```

### 1.6 Audit Logs (Append-Only, High Write)

```sql
-- Tenant filter + time range (audit log viewer)
CREATE INDEX idx_audit_company_time ON audit_logs(company_id, created_at DESC);

-- Entity lookup (show all changes to a specific ticket/user/customer)
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);

-- Actor lookup (show all actions by a specific user)
CREATE INDEX idx_audit_actor ON audit_logs(actor_id, created_at DESC);
```

### 1.7 Login History

```sql
CREATE INDEX idx_login_user ON login_history(user_id, created_at DESC);
CREATE INDEX idx_login_customer ON login_history(customer_id, created_at DESC)
  WHERE customer_id IS NOT NULL;
CREATE INDEX idx_login_company ON login_history(company_id, created_at DESC);
```

### 1.8 Notifications

```sql
-- User inbox (paginated, unread first)
CREATE INDEX idx_notifications_user ON notifications(recipient_user_id, is_read, created_at DESC)
  WHERE recipient_user_id IS NOT NULL;

-- Customer inbox
CREATE INDEX idx_notifications_customer ON notifications(recipient_customer_id, is_read, created_at DESC)
  WHERE recipient_customer_id IS NOT NULL;
```

### 1.9 RBAC Tables

```sql
-- Permission resolution (called on every authenticated request)
CREATE INDEX idx_user_perm_groups_user ON user_permission_groups(user_id);
CREATE INDEX idx_user_perm_overrides_user ON user_permission_overrides(user_id);
CREATE INDEX idx_perm_group_perms_group ON permission_group_permissions(permission_group_id);
CREATE INDEX idx_permissions_slug ON permissions(slug);
```

### 1.10 Refresh Tokens

```sql
-- Token lookup (called on every refresh request)
CREATE INDEX idx_refresh_tokens_hash ON refresh_tokens(token_hash)
  WHERE is_revoked = false;
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id)
  WHERE is_revoked = false;
```

> **Key Principle**: Use **partial indexes** (`WHERE` clauses) extensively. They are smaller, faster, and only index rows you actually query. A partial index on `status != 'closed'` can be 10x smaller than a full index.

---

## 2. Multi-Tenant Query Isolation (RLS)

### 2.1 Row-Level Security Policies

```sql
-- Enable RLS on all tenant-scoped tables
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (applied per-table)
CREATE POLICY tenant_isolation ON customers
  USING (company_id = current_setting('app.current_company_id')::uuid);

CREATE POLICY tenant_isolation ON conversations
  USING (company_id = current_setting('app.current_company_id')::uuid);

CREATE POLICY tenant_isolation ON messages
  USING (company_id = current_setting('app.current_company_id')::uuid);

CREATE POLICY tenant_isolation ON tickets
  USING (company_id = current_setting('app.current_company_id')::uuid);

-- ... repeat for all tenant-scoped tables
```

### 2.2 Tenant Context Setting (Already in DbService)

Your `db.service.ts` already has the `setTenantContext()` method. This must be called at the start of every transaction:

```typescript
// Inside TenantContextInterceptor
await this.dbService.setTenantContext(companyId);
```

### 2.3 Important: Use a Separate Non-RLS Role for Migrations

```sql
-- Migration role bypasses RLS
CREATE ROLE primeone_migrator WITH LOGIN PASSWORD '...';
GRANT ALL ON ALL TABLES IN SCHEMA public TO primeone_migrator;
ALTER ROLE primeone_migrator SET row_security = off;

-- Application role enforces RLS
CREATE ROLE primeone_app WITH LOGIN PASSWORD '...';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO primeone_app;
```

---

## 3. Connection Pooling

### 3.1 Current Setup (db.service.ts)

Your current pool is `max: 20`. This is fine for dev but needs tuning for production.

### 3.2 Production Formula

```
Max Connections = (CPU cores × 2) + Effective Disk Spindles
```

For a typical cloud PostgreSQL with 4 vCPUs and SSD:
- **PostgreSQL max_connections**: `100`
- **Application pool size**: `20` per NestJS instance
- **If 3 NestJS replicas**: `20 × 3 = 60` total connections (within budget)

### 3.3 Use PgBouncer in Production

```
App → PgBouncer (transaction pooling) → PostgreSQL
```

PgBouncer sits between your app and PostgreSQL, recycling connections:
- **Mode**: `transaction` (most efficient — connection released after each transaction)
- **Pool Size**: 100 client connections → 20 server connections
- **Benefit**: 5x more concurrent users with the same PostgreSQL resources

### 3.4 Update postgres.js Config for Production

```typescript
this.client = postgres(connectionString, {
  max: 20,                    // Pool size per instance
  idle_timeout: 20,           // Close idle connections after 20s
  connect_timeout: 5,         // Fail fast on connection issues
  max_lifetime: 60 * 30,     // Recycle connections every 30 min
  prepare: true,              // Use prepared statements (30% faster)
  onnotice: () => {},
});
```

---

## 4. Full-Text Search (For Subscriber CRM)

### 4.1 The Problem

CSRs search for subscribers by name, phone, CNIC, customer code, area, or PPPoE username. Using `LIKE '%query%'` is catastrophically slow on 50k+ rows.

### 4.2 The Solution: pg_trgm + GIN Indexes

```sql
-- Enable the trigram extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create a trigram GIN index (fuzzy search, typo-tolerant)
CREATE INDEX idx_customers_trgm_name ON customers
  USING GIN (full_name gin_trgm_ops);

CREATE INDEX idx_customers_trgm_phone ON customers
  USING GIN (phone gin_trgm_ops);
```

### 4.3 Query Pattern (Drizzle ORM)

```typescript
// Fast fuzzy search with similarity scoring
const results = await db.execute(sql`
  SELECT *, similarity(full_name, ${searchTerm}) AS score
  FROM customers
  WHERE company_id = ${companyId}
    AND (
      full_name % ${searchTerm}           -- trigram similarity
      OR phone LIKE ${`%${searchTerm}%`}
      OR customer_code = ${searchTerm}
      OR cnic = ${searchTerm}
    )
  ORDER BY score DESC
  LIMIT 25
`);
```

### 4.4 Performance Comparison

| Method | 50k Rows | 500k Rows |
|:---|:---|:---|
| `LIKE '%khan%'` | 120ms | 1,200ms |
| `pg_trgm + GIN` | 3ms | 12ms |
| Full-text `tsvector` | 2ms | 8ms |

---

## 5. Query Optimization Patterns

### 5.1 Always Use `SELECT` Only What You Need

```typescript
// BAD: Fetches all 40+ columns including passwordHash, fcmToken, notes
const customers = await db.select().from(schema.customers);

// GOOD: Fetch only what the list view needs
const customers = await db.select({
  id: schema.customers.id,
  fullName: schema.customers.fullName,
  phone: schema.customers.phone,
  status: schema.customers.status,
  packageName: schema.customers.packageName,
  pppoeStatus: schema.customers.pppoeStatus,
}).from(schema.customers)
  .where(eq(schema.customers.companyId, companyId))
  .limit(20)
  .offset(0);
```

### 5.2 Cursor-Based Pagination (For Large Tables)

Offset pagination (`OFFSET 10000`) gets slower as offset increases. Use cursor pagination for chat messages and audit logs:

```typescript
// Cursor-based: constant speed regardless of page depth
const messages = await db.select()
  .from(schema.messages)
  .where(and(
    eq(schema.messages.conversationId, conversationId),
    lt(schema.messages.createdAt, cursorTimestamp), // cursor = last item's timestamp
  ))
  .orderBy(desc(schema.messages.createdAt))
  .limit(50);
```

### 5.3 Batch Inserts (Audit Logs, Notifications)

```typescript
// BAD: 100 individual INSERT statements
for (const log of logs) {
  await db.insert(schema.auditLogs).values(log);
}

// GOOD: Single bulk INSERT
await db.insert(schema.auditLogs).values(logs); // Drizzle handles batching
```

### 5.4 Use Transactions for Multi-Table Writes

```typescript
// Atomic: ticket + activity + notification in one transaction
await db.transaction(async (tx) => {
  const [ticket] = await tx.insert(schema.tickets).values(ticketData).returning();
  await tx.insert(schema.ticketActivities).values({
    ticketId: ticket.id,
    activityType: 'created',
    ...
  });
  await tx.insert(schema.notifications).values({
    title: `New ticket: ${ticket.ticketNumber}`,
    ...
  });
});
```

---

## 6. Caching Layer (Redis)

### 6.1 What to Cache

| Data | TTL | Key Pattern | Why |
|:---|:---|:---|:---|
| User permissions | 5 min | `perms:<userId>` | Called on every request, rarely changes |
| Company settings | 10 min | `settings:<companyId>` | Read-heavy, write-rare |
| Customer 360° telemetry | 30-60s | `telemetry:<customerId>` | Hardware API calls are slow (200-500ms) |
| Online presence | Realtime | `presence:<companyId>` (Redis SET) | WebSocket events |
| Conversation unread counts | 30s | `unread:<conversationId>` | Frequently polled by frontend |
| Permission slugs catalog | 1 hour | `slugs:all` | Never changes in prod |

### 6.2 Cache-Aside Pattern

```typescript
async getCustomer360(customerId: string): Promise<Customer360> {
  const cacheKey = `360:${customerId}`;
  
  // 1. Check cache first
  const cached = await this.redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // 2. Cache miss → query DB + external APIs
  const data = await this.aggregateCustomer360(customerId);
  
  // 3. Store in cache with TTL
  await this.redis.setex(cacheKey, 45, JSON.stringify(data));
  
  return data;
}
```

### 6.3 Cache Invalidation

```typescript
// When customer is updated, bust the cache
async updateCustomer(id: string, data: UpdateCustomerDto) {
  await db.update(schema.customers).set(data).where(eq(schema.customers.id, id));
  await this.redis.del(`360:${id}`); // Bust cache
}
```

---

## 7. Write Optimization

### 7.1 Avoid Unnecessary `updatedAt` Triggers

Use PostgreSQL triggers instead of application-level timestamp updates:

```sql
-- Auto-update updatedAt on any row modification
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updatedAt
CREATE TRIGGER trg_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ... repeat for all tables with updated_at
```

### 7.2 UPSERT for Idempotent Operations

```typescript
// Safe upsert for settings (no race conditions)
await db.insert(schema.companySettings)
  .values({ companyId, key: 'sla_response_minutes', value: '30' })
  .onConflictDoUpdate({
    target: [schema.companySettings.companyId, schema.companySettings.key],
    set: { value: '30', updatedAt: new Date() },
  });
```

---

## 8. Table Partitioning

### 8.1 Which Tables Need Partitioning

For tables that grow indefinitely and are queried by time range:

| Table | Strategy | Partition Key |
|:---|:---|:---|
| `messages` | Range by month | `created_at` |
| `audit_logs` | Range by month | `created_at` |
| `login_history` | Range by month | `created_at` |
| `ticket_activities` | Range by quarter | `created_at` |

### 8.2 Example: Messages Table Partitioning

```sql
-- Convert messages to a partitioned table
CREATE TABLE messages_partitioned (
  LIKE messages INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- Create monthly partitions
CREATE TABLE messages_2026_09 PARTITION OF messages_partitioned
  FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');

CREATE TABLE messages_2026_10 PARTITION OF messages_partitioned
  FOR VALUES FROM ('2026-10-01') TO ('2026-11-01');

-- Auto-create partitions (use pg_partman extension)
CREATE EXTENSION IF NOT EXISTS pg_partman;
SELECT partman.create_parent('public.messages_partitioned', 'created_at', 'native', 'monthly');
```

### 8.3 When to Partition

- **Not yet**: With < 1M rows, indexes alone are sufficient
- **Start partitioning**: When messages or audit_logs exceed 10M rows
- **Benefit**: Queries for "last 30 days" only scan 1 partition instead of the entire table

---

## 9. JSONB Optimization

### 9.1 Current JSONB Columns

- `messages.metadata`, `tickets.metadata`, `conversations.metadata`
- `tickets.attachments` (array of URLs)
- `audit_logs.old_values`, `audit_logs.new_values`

### 9.2 Index JSONB If You Query It

```sql
-- Only if you filter tickets by a metadata field
CREATE INDEX idx_tickets_metadata ON tickets USING GIN (metadata jsonb_path_ops);

-- Query example
SELECT * FROM tickets WHERE metadata @> '{"source": "whatsapp"}';
```

### 9.3 When NOT to Use JSONB

- **Don't** store structured, frequently-queried data in JSONB (use proper columns)
- **Do** use JSONB for flexible, rarely-queried extension data (metadata, old/new values)

---

## 10. Security Hardening

### 10.1 Principle of Least Privilege

```sql
-- Create a restricted application role
CREATE ROLE primeone_app WITH LOGIN PASSWORD 'strong_password_here';

-- Grant only necessary permissions
GRANT CONNECT ON DATABASE primeone TO primeone_app;
GRANT USAGE ON SCHEMA public TO primeone_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO primeone_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO primeone_app;

-- NEVER grant: DROP, TRUNCATE, CREATE, ALTER to the app role
```

### 10.2 Password Hashing

Already using `bcryptjs` with salt rounds = 10. This is solid. Consider upgrading to **Argon2id** for new projects (memory-hard, GPU-resistant).

### 10.3 SQL Injection Prevention

Your stack is already safe:
- **Drizzle ORM**: All queries are parameterized by default
- **postgres.js**: Uses prepared statements with `$1, $2` parameter binding
- **Never** concatenate user input into raw SQL strings

### 10.4 Encrypt Sensitive Columns

```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- For highly sensitive data (API keys, secrets), use column-level encryption
-- Store encrypted, decrypt at application level
```

### 10.5 SSL/TLS Connection Enforcement

```typescript
// In production, enforce SSL connections
this.client = postgres(connectionString, {
  ssl: { rejectUnauthorized: true },  // Require valid SSL cert
  // OR for development:
  // ssl: 'require',
});
```

### 10.6 Audit Everything

The `audit_logs` table already exists. Ensure:
- Every `UPDATE` and `DELETE` is logged with old/new values
- Every login attempt (success/failure) is in `login_history`
- Sensitive operations (permission changes, user creation) always create audit entries

---

## 11. Monitoring & Maintenance

### 11.1 Slow Query Detection

```sql
-- Enable slow query logging (queries > 200ms)
ALTER SYSTEM SET log_min_duration_statement = 200;
ALTER SYSTEM SET log_statement = 'none';  -- Don't log all queries
SELECT pg_reload_conf();
```

### 11.2 Index Usage Monitoring

```sql
-- Find unused indexes (wasting write performance)
SELECT indexrelname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;

-- Find missing indexes (sequential scans on large tables)
SELECT relname, seq_scan, idx_scan, n_live_tup
FROM pg_stat_user_tables
WHERE seq_scan > idx_scan AND n_live_tup > 10000
ORDER BY seq_scan - idx_scan DESC;
```

### 11.3 Automatic VACUUM & ANALYZE

```sql
-- PostgreSQL auto-vacuums by default. Tune for high-write tables:
ALTER TABLE messages SET (
  autovacuum_vacuum_scale_factor = 0.05,   -- Vacuum when 5% of rows are dead (default 20%)
  autovacuum_analyze_scale_factor = 0.02   -- Analyze when 2% of rows change
);

ALTER TABLE audit_logs SET (
  autovacuum_vacuum_scale_factor = 0.05,
  autovacuum_analyze_scale_factor = 0.02
);
```

### 11.4 Table Bloat Detection

```sql
-- Check table bloat (dead rows wasting disk space)
SELECT relname, n_dead_tup, n_live_tup,
  round(n_dead_tup::numeric / GREATEST(n_live_tup, 1) * 100, 2) AS dead_pct
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000
ORDER BY n_dead_tup DESC;
```

---

## 12. PostgreSQL Configuration Tuning

### 12.1 Memory Settings (for 4GB RAM server)

```ini
# postgresql.conf

# Shared buffers: 25% of total RAM
shared_buffers = 1GB

# Work memory per query sort/hash (careful: per-operation, not per-connection)
work_mem = 16MB

# Maintenance operations (VACUUM, CREATE INDEX)
maintenance_work_mem = 256MB

# Effective cache size: 75% of total RAM (tells planner how much OS cache is available)
effective_cache_size = 3GB
```

### 12.2 WAL & Checkpoint Settings

```ini
# Write-Ahead Log settings for write-heavy workloads
wal_buffers = 64MB
checkpoint_completion_target = 0.9
max_wal_size = 2GB
min_wal_size = 512MB
```

### 12.3 Planner Settings

```ini
# Random page cost (lower for SSD storage)
random_page_cost = 1.1        # Default is 4.0 (for spinning disks)
effective_io_concurrency = 200 # For SSD
```

### 12.4 Connection Settings

```ini
max_connections = 100
superuser_reserved_connections = 3
```

---

## 13. Backup & Recovery

### 13.1 Automated Backups

```bash
# Daily logical backup (pg_dump)
pg_dump -Fc -Z9 -j4 primeone > /backups/primeone_$(date +%Y%m%d).dump

# Restore from backup
pg_restore -d primeone -j4 /backups/primeone_20260902.dump
```

### 13.2 Point-in-Time Recovery (PITR)

For production, enable WAL archiving for point-in-time recovery:

```ini
# postgresql.conf
archive_mode = on
archive_command = 'cp %p /wal_archive/%f'
```

### 13.3 Managed Database Providers

If using managed PostgreSQL (Supabase, Neon, RDS), backups are automatic. Verify:
- Daily automated backups
- WAL-based PITR with 7-day retention
- Cross-region replication for disaster recovery

---

## 14. Migration to Production Checklist

When moving from development to production, apply this checklist:

### Database

- [ ] Run `npm run db:push` to apply schema to production database
- [ ] Run all index creation SQL from Section 1
- [ ] Enable RLS policies from Section 2
- [ ] Apply `update_updated_at` triggers from Section 7.1
- [ ] Configure autovacuum tuning from Section 11.3
- [ ] Apply PostgreSQL config tuning from Section 12
- [ ] Set up automated backups from Section 13

### Security

- [ ] Create separate `primeone_app` role with least privilege
- [ ] Enforce SSL connections from application to database
- [ ] Rotate all default passwords from `.env`
- [ ] Enable `log_min_duration_statement = 200` for slow query detection
- [ ] Disable `log_statement = 'all'` (avoid logging sensitive data)

### Performance

- [ ] Enable PgBouncer for connection pooling
- [ ] Configure Redis caching for permission sets and telemetry
- [ ] Enable `prepare: true` in postgres.js config
- [ ] Run `ANALYZE` on all tables after initial data load
- [ ] Monitor with `pg_stat_user_tables` and `pg_stat_user_indexes`

---

> **Bottom Line**: The biggest performance wins for Prime One will come from:  
> 1. **Strategic indexes** (Section 1) — 10-100x faster reads  
> 2. **Redis caching** for permissions and telemetry (Section 6) — eliminates repeated DB hits  
> 3. **Full-text search with pg_trgm** (Section 4) — instant subscriber search  
> 4. **Connection pooling with PgBouncer** (Section 3) — handles 10x more concurrent users  
> 5. **RLS enforcement** (Section 2) — zero-trust tenant isolation at the database level
