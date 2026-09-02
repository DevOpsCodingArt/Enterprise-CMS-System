# PRIME ONE — Backend Implementation Plan

> **Author**: Zayan Sheikh  
> **Stack**: NestJS 11 + Fastify · Drizzle ORM · PostgreSQL 16 · Redis 7 · Socket.io · BullMQ  
> **Last Updated**: September 2, 2026

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Existing Foundation Audit](#3-existing-foundation-audit)
4. [Phase 1 — Core Infrastructure](#phase-1--core-infrastructure-week-1)
5. [Phase 2 — Authentication & Authorization](#phase-2--authentication--authorization-week-2)
6. [Phase 3 — Tenant & Branch Management](#phase-3--tenant--branch-management-week-2-3)
7. [Phase 4 — Customer CRM & Subscriber Management](#phase-4--customer-crm--subscriber-management-week-3)
8. [Phase 5 — RBAC & Permission Engine](#phase-5--rbac--permission-engine-week-3-4)
9. [Phase 6 — Trouble Tickets & SLA Engine](#phase-6--trouble-tickets--sla-engine-week-4)
10. [Phase 7 — Real-Time Chat & WebSocket Gateway](#phase-7--real-time-chat--websocket-gateway-week-5)
11. [Phase 8 — Notifications & Job Queues](#phase-8--notifications--job-queues-week-5-6)
12. [Phase 9 — File Upload & Media Storage](#phase-9--file-upload--media-storage-week-6)
13. [Phase 10 — Audit Logging & Compliance](#phase-10--audit-logging--compliance-week-6)
14. [Phase 11 — Reporting & Analytics](#phase-11--reporting--analytics-week-7)
15. [Phase 12 — Platform Owner SaaS Module](#phase-12--platform-owner-saas-module-week-7)
16. [Phase 13 — Integration Connectors](#phase-13--integration-connectors-week-8)
17. [Database Schema Reference](#database-schema-reference)
18. [API Endpoint Catalog](#api-endpoint-catalog)
19. [WebSocket Event Catalog](#websocket-event-catalog)
20. [Environment Variables](#environment-variables)
21. [Deployment & DevOps](#deployment--devops)
22. [Testing Strategy](#testing-strategy)

---

## 1. Executive Summary

Prime One is a **multi-tenant SaaS platform** built for Internet Service Providers (ISPs) and telecom operators. The backend serves three distinct frontends:

| Portal | Route Prefix | Primary Users |
|:---|:---|:---|
| **Platform Owner** | `/platform/*` | SaaS super-admin managing all ISP tenants |
| **Company Operations** | `/company/*` | ISP staff — owner, CSR, NOC, field techs, finance, HR |
| **Customer Self-Care** | `/portal/*` | End subscribers — broadband account, billing, tickets |

The backend must provide:
- **Zero-trust multi-tenant isolation** via PostgreSQL RLS + JWT tenant context
- **Granular permission-driven RBAC** (not hard-coded roles)
- **Real-time bidirectional communication** via Socket.io for live chat
- **Asynchronous job processing** via BullMQ for notifications, SLA escalations, telemetry polling
- **Hardware integration abstraction** for SmartOLT, MikroTik, and billing connectors

---

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js 15)                       │
│  ┌────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
│  │ Platform   │  │ Company Ops      │  │ Customer Portal  │     │
│  │ /platform  │  │ /company/*       │  │ /portal/*        │     │
│  └──────┬─────┘  └────────┬─────────┘  └────────┬─────────┘     │
│         │                 │                      │               │
│         └─────────────────┼──────────────────────┘               │
│                           │ HTTP + WebSocket                     │
└───────────────────────────┼──────────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   API Gateway  │  ← Fastify + NestJS 11
                    │   /api/v1/*    │
                    └───────┬────────┘
                            │
        ┌───────────────────┼───────────────────────┐
        │                   │                       │
   ┌────▼────┐       ┌─────▼──────┐          ┌─────▼──────┐
   │ Auth    │       │ Domain     │          │ Real-Time  │
   │ Module  │       │ Modules    │          │ Gateway    │
   │ JWT/OTP │       │ CRM,Ticket │          │ Socket.io  │
   └────┬────┘       │ Chat,RBAC  │          └─────┬──────┘
        │            └─────┬──────┘                │
        │                  │                       │
   ┌────▼──────────────────▼───────────────────────▼──────┐
   │                  PostgreSQL 16 + PostGIS              │
   │                  (RLS Tenant Isolation)                │
   └───────────────────────┬──────────────────────────────┘
                           │
   ┌───────────────────────┼───────────────────────┐
   │                       │                       │
   ┌────▼────┐      ┌─────▼──────┐        ┌──────▼──────┐
   │ Redis 7 │      │  BullMQ    │        │ S3 / R2     │
   │ Cache & │      │  Job Queue │        │ File Store  │
   │ Presence│      │  Workers   │        │             │
   └─────────┘      └────────────┘        └─────────────┘
```

### Directory Structure (Target)

```text
backend/src/
├── config/                          # Environment & service configs
│   ├── database.config.ts
│   ├── redis.config.ts
│   ├── jwt.config.ts
│   └── s3.config.ts
├── core/                            # Cross-cutting concerns
│   ├── decorators/
│   │   ├── current-user.decorator.ts    # @CurrentUser()
│   │   ├── tenant-id.decorator.ts       # @TenantId()
│   │   ├── require-permissions.decorator.ts  # @RequirePermissions()
│   │   └── public.decorator.ts          # @Public()
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   ├── tenant.guard.ts
│   │   ├── permission.guard.ts
│   │   └── ws-auth.guard.ts
│   ├── interceptors/
│   │   ├── tenant-context.interceptor.ts
│   │   ├── audit-log.interceptor.ts
│   │   └── transform.interceptor.ts
│   ├── filters/
│   │   └── http-exception.filter.ts
│   ├── middleware/
│   │   └── rate-limiter.middleware.ts
│   └── pipes/
│       └── zod-validation.pipe.ts
├── db/                              # Database layer (EXISTS)
│   ├── schema/                      # Drizzle table definitions (EXISTS)
│   ├── migrations/                  # Generated SQL migrations
│   └── seed.ts                      # Database seeder (EXISTS)
├── modules/
│   ├── auth/                        # Authentication & sessions
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── strategies/
│   │   │   └── jwt.strategy.ts
│   │   └── dto/
│   │       ├── login.dto.ts
│   │       ├── register.dto.ts
│   │       └── refresh-token.dto.ts
│   ├── tenant/                      # Multi-tenant company mgmt
│   │   ├── tenant.module.ts
│   │   ├── tenant.controller.ts
│   │   └── tenant.service.ts
│   ├── branch/                      # Branch office mgmt
│   │   ├── branch.module.ts
│   │   ├── branch.controller.ts
│   │   └── branch.service.ts
│   ├── rbac/                        # Permission engine
│   │   ├── rbac.module.ts
│   │   ├── rbac.controller.ts
│   │   └── rbac.service.ts
│   ├── user/                        # Staff provisioning
│   │   ├── user.module.ts
│   │   ├── user.controller.ts
│   │   └── user.service.ts
│   ├── customer/                    # CRM & subscriber 360°
│   │   ├── customer.module.ts
│   │   ├── customer.controller.ts
│   │   └── customer.service.ts
│   ├── chat/                        # Real-time helpdesk chat
│   │   ├── chat.module.ts
│   │   ├── chat.controller.ts
│   │   ├── chat.service.ts
│   │   └── chat.gateway.ts         # Socket.io WebSocket gateway
│   ├── ticket/                      # Trouble tickets & SLA
│   │   ├── ticket.module.ts
│   │   ├── ticket.controller.ts
│   │   └── ticket.service.ts
│   ├── notification/                # Push, email, in-app
│   │   ├── notification.module.ts
│   │   ├── notification.controller.ts
│   │   └── notification.service.ts
│   ├── file/                        # Upload & media
│   │   ├── file.module.ts
│   │   ├── file.controller.ts
│   │   └── file.service.ts
│   ├── audit/                       # Immutable audit logs
│   │   ├── audit.module.ts
│   │   ├── audit.controller.ts
│   │   └── audit.service.ts
│   ├── report/                      # Analytics & metrics
│   │   ├── report.module.ts
│   │   ├── report.controller.ts
│   │   └── report.service.ts
│   ├── platform/                    # SaaS admin (tenants fleet)
│   │   ├── platform.module.ts
│   │   ├── platform.controller.ts
│   │   └── platform.service.ts
│   └── integration/                 # Hardware connectors
│       ├── integration.module.ts
│       ├── smartolt.connector.ts
│       ├── mikrotik.connector.ts
│       └── zlultra.connector.ts
└── main.ts                          # Fastify bootstrap (EXISTS)
```

---

## 3. Existing Foundation Audit

### What Already Exists

| Component | File(s) | Status |
|:---|:---|:---|
| NestJS + Fastify bootstrap | `src/main.ts` | Ready (port 4000, `/api/v1` prefix, CORS enabled) |
| AppModule | `src/app.module.ts` | Ready (ConfigModule global, DbModule imported) |
| Drizzle DB Service | `src/db/db.service.ts` | Ready (postgres-js client, pool=20, RLS helper) |
| DbModule (Global) | `src/db/db.module.ts` | Ready (@Global, exports `DbService` + `DRIZZLE_DB`) |
| Drizzle Config | `drizzle.config.ts` | Ready (schema path, PostgreSQL dialect) |
| Database Seed | `src/db/seed.ts` | Ready (605 lines, full demo data) |
| Schema: `platform_owners` | `src/db/schema/platform-owners.ts` | 5 columns |
| Schema: `companies` | `src/db/schema/companies.ts` | 20+ columns (branding, working hours, subscription) |
| Schema: `branches` | `src/db/schema/branches.ts` | GPS-enabled branch offices |
| Schema: `users` | `src/db/schema/users.ts` | Staff with department, FCM, presence |
| Schema: `customers` | `src/db/schema/customers.ts` | ISP subscribers with PPPoE, ONU, telemetry |
| Schema: `rbac` | `src/db/schema/rbac.ts` | 6 tables (categories, permissions, groups, overrides) |
| Schema: `chat` | `src/db/schema/chat.ts` | Conversations, messages, transfers, quick replies, working hours |
| Schema: `tickets` | `src/db/schema/tickets.ts` | Tickets + activity log |
| Schema: `notifications` | `src/db/schema/notifications.ts` | Notifications, OTPs, refresh tokens |
| Schema: `audit` | `src/db/schema/audit.ts` | Audit logs, login history, company settings |
| `.env` | `.env` | DB, Redis, JWT, R2, SMTP configured |

### What Needs To Be Built

| Layer | Components | Priority |
|:---|:---|:---|
| **Core Guards & Decorators** | `JwtAuthGuard`, `TenantGuard`, `PermissionGuard`, `@CurrentUser`, `@TenantId`, `@RequirePermissions`, `@Public` | Critical |
| **Core Interceptors** | `TenantContextInterceptor`, `TransformInterceptor`, `AuditLogInterceptor` | Critical |
| **Core Filters** | `HttpExceptionFilter` (unified error envelope) | Critical |
| **Auth Module** | Login (staff + customer), JWT issuance, refresh rotation, logout | Critical |
| **RBAC Module** | Permission resolution, group management, user overrides | Critical |
| **Tenant Module** | Company CRUD, branding, working hours, settings | High |
| **Branch Module** | Branch CRUD, staff allocation | High |
| **User Module** | Staff provisioning, presence, directory | High |
| **Customer Module** | Subscriber CRM, 360 degree aggregation, search | High |
| **Ticket Module** | CRUD, SLA engine, assignment, dispatch, activities | High |
| **Chat Module** | REST + WebSocket gateway, conversations, messages | Medium |
| **Notification Module** | In-app alerts, FCM push, email dispatch | Medium |
| **File Module** | Pre-signed upload URLs, MIME validation | Medium |
| **Audit Module** | Query audit logs, login history | Medium |
| **Report Module** | Chat FRT/ART, ticket SLA metrics, subscriber stats | Low |
| **Platform Module** | Tenant fleet management, MRR dashboard | Low |
| **Integration Module** | SmartOLT, MikroTik, ZL Ultra connectors | Low |

---

## Phase 1 — Core Infrastructure (Week 1)

### 1.1 Configuration Module

```text
src/config/
├── database.config.ts    # DATABASE_URL, pool settings
├── redis.config.ts       # REDIS_URL, connection options
├── jwt.config.ts         # Access/Refresh secrets & TTLs
└── s3.config.ts          # R2/S3 bucket, credentials
```

- Register all configs via `ConfigModule.forRoot()` with `registerAs()` namespaces.
- Validate environment variables using `zod` schemas at boot time.

### 1.2 Global Exception Filter

**File**: `src/core/filters/http-exception.filter.ts`

Unified error response envelope matching frontend's `ApiErrorEnvelope`:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You do not have permission to transfer this conversation",
    "details": []
  }
}
```

### 1.3 Transform Interceptor

**File**: `src/core/interceptors/transform.interceptor.ts`

Wraps all successful responses into the standard `ApiResponse<T>` envelope:

```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "timestamp": "2026-09-02T12:00:00.000Z",
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

### 1.4 Zod Validation Pipe

**File**: `src/core/pipes/zod-validation.pipe.ts`

Runtime request body validation using `zod` schemas integrated as a NestJS `PipeTransform`.

### 1.5 Rate Limiter Middleware

**File**: `src/core/middleware/rate-limiter.middleware.ts`

Redis-backed sliding window rate limiter:
- Default: 100 req/min per IP
- Auth endpoints: 10 req/min per IP
- WebSocket connections: 5 connects/min per IP

---

## Phase 2 — Authentication & Authorization (Week 2)

### 2.1 JWT Strategy

**File**: `src/modules/auth/strategies/jwt.strategy.ts`

JWT payload structure (matches frontend `UserProfile` + `proxy.ts` expectations):

```typescript
interface JwtPayload {
  sub: string;              // user.id or customer.id
  email: string;
  role: string;             // 'platform_owner' | 'company_owner' | 'staff' | 'customer'
  companyId: string | null;
  branchId: string | null;
  permissions: string[];    // ['chat.view', 'chat.send', 'ticket.create', ...]
  userType: 'platform_owner' | 'user' | 'customer';
  iat: number;
  exp: number;
}
```

### 2.2 Auth Endpoints

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `POST` | `/api/v1/auth/login` | Staff login (email + password) | Public |
| `POST` | `/api/v1/auth/login/customer` | Customer login (email/phone + password) | Public |
| `POST` | `/api/v1/auth/login/platform` | Platform owner login | Public |
| `POST` | `/api/v1/auth/refresh` | Rotate access token using refresh token | Public |
| `POST` | `/api/v1/auth/logout` | Revoke refresh token | Authenticated |
| `GET`  | `/api/v1/auth/me` | Get current user profile + permissions | Authenticated |
| `POST` | `/api/v1/auth/otp/send` | Send OTP to email | Public |
| `POST` | `/api/v1/auth/otp/verify` | Verify OTP code | Public |

### 2.3 Token Lifecycle

1. **Access Token**: 15-minute TTL, contains full permission set in payload.
2. **Refresh Token**: 7-day TTL, stored as bcrypt hash in `refresh_tokens` table.
3. **Rotation**: Every refresh request issues a new access + refresh token pair and revokes the old refresh token.
4. **Multi-device**: Each device gets its own refresh token (tracked via `deviceInfo`).

### 2.4 Custom Decorators

| Decorator | Purpose |
|:---|:---|
| `@CurrentUser()` | Extract authenticated user from request |
| `@TenantId()` | Extract `companyId` from JWT payload |
| `@RequirePermissions('chat.view', 'chat.send')` | Guard route with permission check |
| `@Public()` | Mark endpoint as publicly accessible (skip JWT guard) |

### 2.5 Guards

| Guard | Purpose |
|:---|:---|
| `JwtAuthGuard` | Validates JWT access token on every request |
| `TenantGuard` | Ensures user belongs to the tenant they're accessing |
| `PermissionGuard` | Checks user permissions against `@RequirePermissions()` |
| `WsAuthGuard` | Validates JWT on WebSocket handshake |

### 2.6 Tenant Context Interceptor

**File**: `src/core/interceptors/tenant-context.interceptor.ts`

- Extracts `companyId` from verified JWT.
- Sets PostgreSQL RLS context variable: `SET LOCAL app.current_company_id = '<uuid>'`.
- Uses `AsyncLocalStorage` to propagate tenant ID to all services within the request lifecycle.

---

## Phase 3 — Tenant & Branch Management (Week 2-3)

### 3.1 Tenant (Company) Endpoints

| Method | Endpoint | Description | Permission |
|:---|:---|:---|:---|
| `GET` | `/api/v1/tenant/profile` | Get current company profile | Authenticated |
| `PUT` | `/api/v1/tenant/profile` | Update company branding & settings | `settings.branding` |
| `GET` | `/api/v1/tenant/settings` | Get company settings (KV pairs) | `settings.branding` |
| `PUT` | `/api/v1/tenant/settings` | Update company settings | `settings.branding` |
| `GET` | `/api/v1/tenant/working-hours` | Get working hours config | Authenticated |
| `PUT` | `/api/v1/tenant/working-hours` | Update working hours | `settings.working_hours` |

### 3.2 Branch Endpoints

| Method | Endpoint | Description | Permission |
|:---|:---|:---|:---|
| `GET` | `/api/v1/branches` | List all branches (paginated) | `branch.view` |
| `GET` | `/api/v1/branches/:id` | Get branch details | `branch.view` |
| `POST` | `/api/v1/branches` | Create new branch | `branch.manage` |
| `PUT` | `/api/v1/branches/:id` | Update branch | `branch.manage` |
| `DELETE` | `/api/v1/branches/:id` | Soft-delete branch | `branch.manage` |

---

## Phase 4 — Customer CRM & Subscriber Management (Week 3)

### 4.1 Customer Endpoints

| Method | Endpoint | Description | Permission |
|:---|:---|:---|:---|
| `GET` | `/api/v1/customers` | List subscribers (paginated, filterable) | `customer.view` |
| `GET` | `/api/v1/customers/:id` | Get customer details | `customer.view` |
| `GET` | `/api/v1/customers/:id/360` | Get Customer 360 degree view (aggregated) | `customer.view_360` |
| `POST` | `/api/v1/customers` | Register new subscriber | `customer.create` |
| `PUT` | `/api/v1/customers/:id` | Update subscriber info | `customer.edit` |
| `GET` | `/api/v1/customers/search` | Full-text search (name, phone, CNIC, code) | `customer.view` |
| `GET` | `/api/v1/customers/:id/tickets` | Get customer's ticket history | `customer.view` |
| `GET` | `/api/v1/customers/:id/conversations` | Get customer's chat history | `customer.view` |

### 4.2 Customer 360 degree Aggregation

The `GET /api/v1/customers/:id/360` endpoint must aggregate:

1. **Profile Data**: Name, CNIC, phone, address, GPS, branch, registration date.
2. **PPPoE/RADIUS Session**: Status (online/offline), uptime, current IP, MAC address (from cache or MikroTik connector).
3. **Optical Signal Health**: RX/TX dBm power, OLT PON port, ONU serial, temperature (from cache or SmartOLT connector).
4. **Billing Status**: Active package, speed, monthly billing amount, expiry date, due balance (from cache or ZL Ultra connector).
5. **Recent Interactions**: Last 5 conversations + last 5 tickets.

> **Non-blocking telemetry**: Hardware connector calls are cached in Redis with 30-60s TTLs. Never block the HTTP response waiting for external API calls.

### 4.3 Customer Self-Care Endpoints (Portal)

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `GET` | `/api/v1/portal/profile` | Get own profile | Customer JWT |
| `PUT` | `/api/v1/portal/profile` | Update own profile | Customer JWT |
| `GET` | `/api/v1/portal/billing` | Get own billing & invoices | Customer JWT |
| `GET` | `/api/v1/portal/diagnostics` | Get own optical signal & speed test | Customer JWT |
| `GET` | `/api/v1/portal/tickets` | Get own tickets | Customer JWT |
| `POST` | `/api/v1/portal/tickets` | Create support ticket | Customer JWT |
| `GET` | `/api/v1/portal/conversations` | Get own chat history | Customer JWT |

---

## Phase 5 — RBAC & Permission Engine (Week 3-4)

### 5.1 Permission Resolution Order

```
1. Platform Owner → Global SaaS access (bypass all checks)
2. Company Owner → Full tenant authority (bypass tenant-level checks)
3. Staff → Evaluated as:
   ┌─────────────────────────────────────────────┐
   │ Aggregate Group Permissions                  │
   │ (union of all assigned permission groups)    │
   │                                              │
   │ + User-Level Overrides                       │
   │   (explicit grant/deny per user,            │
   │    takes precedence over groups)            │
   └─────────────────────────────────────────────┘
```

### 5.2 RBAC Endpoints

| Method | Endpoint | Description | Permission |
|:---|:---|:---|:---|
| `GET` | `/api/v1/rbac/permissions` | List all system permissions | `user.manage_permissions` |
| `GET` | `/api/v1/rbac/categories` | List permission categories | `user.manage_permissions` |
| `GET` | `/api/v1/rbac/groups` | List permission groups for tenant | `user.manage_permissions` |
| `POST` | `/api/v1/rbac/groups` | Create permission group | `user.manage_permissions` |
| `PUT` | `/api/v1/rbac/groups/:id` | Update group (name, permissions) | `user.manage_permissions` |
| `DELETE` | `/api/v1/rbac/groups/:id` | Delete permission group | `user.manage_permissions` |
| `GET` | `/api/v1/rbac/users/:userId/permissions` | Get effective permissions for user | `user.manage_permissions` |
| `PUT` | `/api/v1/rbac/users/:userId/groups` | Assign groups to user | `user.manage_permissions` |
| `PUT` | `/api/v1/rbac/users/:userId/overrides` | Set user-level permission overrides | `user.manage_permissions` |

### 5.3 Permission Slugs (Seeded)

| Category | Permissions |
|:---|:---|
| **Live Chat** | `chat.view`, `chat.send`, `chat.assign`, `chat.transfer`, `chat.close`, `chat.view_internal_notes`, `chat.add_internal_note`, `chat.manage_quick_replies` |
| **Trouble Tickets** | `ticket.view`, `ticket.create`, `ticket.assign`, `ticket.update_status`, `ticket.resolve`, `ticket.close` |
| **Customer CRM** | `customer.view`, `customer.view_360`, `customer.create`, `customer.edit` |
| **User/Staff** | `user.view`, `user.create`, `user.edit`, `user.manage_permissions` |
| **Branch** | `branch.view`, `branch.manage` |
| **Network** | `network.diagnostics`, `network.reboot_onu` |
| **Reports** | `reports.view_chat`, `reports.view_tickets` |
| **Settings** | `settings.branding`, `settings.working_hours` |

---

## Phase 6 — Trouble Tickets & SLA Engine (Week 4)

### 6.1 Ticket Endpoints

| Method | Endpoint | Description | Permission |
|:---|:---|:---|:---|
| `GET` | `/api/v1/tickets` | List tickets (paginated, filterable by status/priority/branch/assignee) | `ticket.view` |
| `GET` | `/api/v1/tickets/:id` | Get ticket details + activity log | `ticket.view` |
| `POST` | `/api/v1/tickets` | Create trouble ticket | `ticket.create` |
| `PUT` | `/api/v1/tickets/:id` | Update ticket (status, priority, notes) | `ticket.update_status` |
| `POST` | `/api/v1/tickets/:id/assign` | Assign ticket to engineer/department | `ticket.assign` |
| `POST` | `/api/v1/tickets/:id/resolve` | Resolve with evidence & material log | `ticket.resolve` |
| `POST` | `/api/v1/tickets/:id/close` | Close ticket (verified resolution) | `ticket.close` |
| `GET` | `/api/v1/tickets/:id/activities` | Get ticket activity timeline | `ticket.view` |
| `POST` | `/api/v1/tickets/:id/activities` | Add activity/comment to ticket | `ticket.update_status` |

### 6.2 Ticket Categories (Enum)

```
fiber_break, onu_failure, router_config, wire_damage, slow_speed,
new_installation, relocation, billing_inquiry, recharge_verification, other
```

### 6.3 SLA Engine (BullMQ Worker)

- **SLA Timer**: Configurable per-company via `company_settings` (e.g., `sla_response_minutes = 30`).
- **Escalation Flow**:
  1. Ticket created → BullMQ delayed job scheduled for SLA deadline.
  2. If not responded within SLA → Auto-escalate priority + notify supervisor.
  3. If not resolved within 2x SLA → Notify company owner.
- **Metric Tracking**: First Response Time (FRT), Average Resolution Time (ART), SLA compliance %.

---

## Phase 7 — Real-Time Chat & WebSocket Gateway (Week 5)

### 7.1 REST Endpoints (Chat History)

| Method | Endpoint | Description | Permission |
|:---|:---|:---|:---|
| `GET` | `/api/v1/conversations` | List active conversations (paginated) | `chat.view` |
| `GET` | `/api/v1/conversations/:id` | Get conversation details | `chat.view` |
| `GET` | `/api/v1/conversations/:id/messages` | Get message history (paginated) | `chat.view` |
| `POST` | `/api/v1/conversations/:id/close` | Close conversation with outcome | `chat.close` |
| `POST` | `/api/v1/conversations/:id/transfer` | Transfer to another agent | `chat.transfer` |
| `GET` | `/api/v1/quick-replies` | List canned responses | `chat.view` |
| `POST` | `/api/v1/quick-replies` | Create quick reply | `chat.manage_quick_replies` |
| `PUT` | `/api/v1/quick-replies/:id` | Update quick reply | `chat.manage_quick_replies` |
| `DELETE` | `/api/v1/quick-replies/:id` | Delete quick reply | `chat.manage_quick_replies` |

### 7.2 WebSocket Events

**File**: `src/modules/chat/chat.gateway.ts`

#### Rooms

| Room Pattern | Scope |
|:---|:---|
| `tenant:<companyId>` | Company-wide system notices |
| `tenant:<companyId>:agents` | Helpdesk agent inbox queue (unassigned conversations) |
| `user:<userId>` | Private notifications to specific user |
| `conversation:<conversationId>` | Active messaging stream |

#### Client to Server Events

| Event | Payload | Description |
|:---|:---|:---|
| `chat:send_message` | `{ conversationId, content, messageType, replyToId? }` | Send a message |
| `chat:typing_start` | `{ conversationId }` | User started typing |
| `chat:typing_stop` | `{ conversationId }` | User stopped typing |
| `chat:mark_read` | `{ conversationId, messageId }` | Mark messages as read |
| `chat:assign` | `{ conversationId }` | Agent self-assigns from queue |
| `presence:heartbeat` | `{}` | Keep-alive ping |

#### Server to Client Events

| Event | Payload | Description |
|:---|:---|:---|
| `chat:new_message` | `ChatMessage` | New message received |
| `chat:message_delivered` | `{ messageId, deliveredAt }` | Message delivered to recipient |
| `chat:message_read` | `{ messageId, readAt }` | Message read by recipient (blue tick) |
| `chat:typing` | `{ conversationId, userId, isTyping }` | Typing indicator |
| `conversation:new` | `Conversation` | New conversation in queue |
| `conversation:assigned` | `{ conversationId, agentId }` | Conversation assigned |
| `conversation:transfer` | `{ conversationId, fromAgent, toAgent, reason }` | Chat transferred |
| `conversation:close` | `{ conversationId, outcome }` | Conversation closed |
| `presence:update` | `{ userId, isOnline }` | User online/offline status |
| `notification:new` | `Notification` | In-app notification push |

### 7.3 Redis Presence & Typing

- **Online Presence**: Redis SET `presence:<companyId>` containing online userIds. Disconnect grace period: 10 seconds.
- **Typing State**: Redis key `typing:<conversationId>:<userId>` with 5-second TTL. Auto-clears if no `typing_start` renewal.

---

## Phase 8 — Notifications & Job Queues (Week 5-6)

### 8.1 Notification Endpoints

| Method | Endpoint | Description | Permission |
|:---|:---|:---|:---|
| `GET` | `/api/v1/notifications` | List current user's notifications (paginated) | Authenticated |
| `PUT` | `/api/v1/notifications/:id/read` | Mark notification as read | Authenticated |
| `PUT` | `/api/v1/notifications/read-all` | Mark all as read | Authenticated |
| `DELETE` | `/api/v1/notifications/:id` | Delete notification | Authenticated |

### 8.2 BullMQ Job Queues

| Queue Name | Job Types | Description |
|:---|:---|:---|
| `notifications` | `push_fcm`, `send_email`, `in_app` | Dispatch notifications |
| `sla-engine` | `sla_check`, `escalate` | SLA timeout monitoring |
| `telemetry` | `poll_smartolt`, `poll_mikrotik` | Hardware signal polling |
| `media` | `compress_image`, `generate_thumbnail` | Media processing |

### 8.3 Email Templates

- Welcome / Registration confirmation
- Password reset OTP
- Ticket created / resolved / escalated
- Monthly billing invoice
- SLA breach alert (to supervisor)

---

## Phase 9 — File Upload & Media Storage (Week 6)

### 9.1 File Endpoints

| Method | Endpoint | Description | Permission |
|:---|:---|:---|:---|
| `POST` | `/api/v1/files/upload-url` | Generate pre-signed S3/R2 upload URL | Authenticated |
| `POST` | `/api/v1/files/upload` | Direct file upload (fallback) | Authenticated |
| `GET` | `/api/v1/files/:id` | Get file metadata | Authenticated |
| `DELETE` | `/api/v1/files/:id` | Delete file | Authenticated |

### 9.2 Supported Media Types

| Category | MIME Types | Max Size |
|:---|:---|:---|
| Image | `image/jpeg`, `image/png`, `image/webp` | 10 MB |
| Document | `application/pdf`, `application/msword` | 25 MB |
| Audio | `audio/mpeg`, `audio/ogg`, `audio/wav` | 15 MB |
| Video | `video/mp4`, `video/webm` | 50 MB |

---

## Phase 10 — Audit Logging & Compliance (Week 6)

### 10.1 Audit Endpoints

| Method | Endpoint | Description | Permission |
|:---|:---|:---|:---|
| `GET` | `/api/v1/audit/logs` | List audit logs (paginated, filterable) | `audit.view_logs` |
| `GET` | `/api/v1/audit/login-history` | List login history | `audit.view_logs` |
| `GET` | `/api/v1/audit/login-history/me` | Own login history | Authenticated |

### 10.2 Audit Log Interceptor

**File**: `src/core/interceptors/audit-log.interceptor.ts`

Automatically captures:
- Actor (who): Platform owner, user, customer, or system
- Action (what): `chat.transfer`, `user.create`, `ticket.resolve`, etc.
- Entity (on what): Entity type + ID
- Changes (diff): `oldValues` and `newValues` as JSONB
- Context: IP address, user agent, timestamp

---

## Phase 11 — Reporting & Analytics (Week 7)

### 11.1 Report Endpoints

| Method | Endpoint | Description | Permission |
|:---|:---|:---|:---|
| `GET` | `/api/v1/reports/chat/summary` | Chat FRT, ART, CSAT, volume metrics | `reports.view_chat` |
| `GET` | `/api/v1/reports/chat/agents` | Per-agent performance breakdown | `reports.view_chat` |
| `GET` | `/api/v1/reports/tickets/summary` | Ticket SLA compliance, volume, MTTR | `reports.view_tickets` |
| `GET` | `/api/v1/reports/tickets/categories` | Breakdown by ticket category | `reports.view_tickets` |
| `GET` | `/api/v1/reports/subscribers/summary` | Active/inactive/suspended count by branch | `customer.view` |
| `GET` | `/api/v1/reports/revenue/summary` | Monthly recurring revenue by package | Company Owner |

---

## Phase 12 — Platform Owner SaaS Module (Week 7)

### 12.1 Platform Endpoints

| Method | Endpoint | Description | Auth |
|:---|:---|:---|:---|
| `GET` | `/api/v1/platform/tenants` | List all ISP tenants | Platform Owner |
| `POST` | `/api/v1/platform/tenants` | Provision new ISP tenant | Platform Owner |
| `GET` | `/api/v1/platform/tenants/:id` | Get tenant details | Platform Owner |
| `PUT` | `/api/v1/platform/tenants/:id` | Update tenant (plan, limits) | Platform Owner |
| `PUT` | `/api/v1/platform/tenants/:id/suspend` | Suspend/reactivate tenant | Platform Owner |
| `GET` | `/api/v1/platform/overview` | SaaS dashboard metrics (MRR, tenant count, node count) | Platform Owner |
| `GET` | `/api/v1/platform/audit` | Global audit log (cross-tenant) | Platform Owner |

---

## Phase 13 — Integration Connectors (Week 8)

### 13.1 Connector Architecture

```text
src/modules/integration/
├── integration.module.ts
├── connectors/
│   ├── smartolt.connector.ts      # TR-069 / SmartOLT API
│   ├── mikrotik.connector.ts      # RouterOS REST API
│   └── zlultra.connector.ts       # ZL Ultra billing API
└── integration.service.ts         # Unified connector facade
```

### 13.2 SmartOLT Connector

| Method | Description |
|:---|:---|
| `getOnuStatus(serial)` | Get ONU online/offline status |
| `getOnuSignal(serial)` | Get RX/TX dBm, temperature |
| `rebootOnu(serial)` | Remote ONU reboot |
| `getOltPonStats(oltId, ponPort)` | Get PON port utilization |

### 13.3 MikroTik Connector

| Method | Description |
|:---|:---|
| `getPppoeSession(username)` | Get active PPPoE session (IP, uptime, MAC) |
| `disconnectPppoe(username)` | Force disconnect PPPoE session |
| `getInterfaceTraffic(interface)` | Get real-time TX/RX bps |
| `getSystemResources(routerId)` | CPU, RAM, uptime |

### 13.4 ZL Ultra Connector

| Method | Description |
|:---|:---|
| `getSubscriberBalance(accountId)` | Get current balance & expiry |
| `rechargeAccount(accountId, amount)` | Apply recharge |
| `getPackageDetails(packageId)` | Get speed, quota, price |

---

## Database Schema Reference

### Table Count Summary

| Table | Description | Seed Rows |
|:---|:---|:---|
| `platform_owners` | SaaS super-admins | 1 |
| `companies` | ISP tenant companies | 1 |
| `branches` | Branch offices | 3 |
| `users` | Staff accounts | 4 |
| `customers` | ISP subscribers | 3 |
| `permission_categories` | Permission groups | 8 |
| `permissions` | Granular permissions | 28 |
| `permission_groups` | Role templates | 4 |
| `permission_group_permissions` | Group to Permission links | 28+ |
| `user_permission_groups` | User to Group assignments | 4 |
| `user_permission_overrides` | Per-user overrides | 0 |
| `conversations` | Chat conversations | 1 |
| `messages` | Chat messages | 4 |
| `chat_transfers` | Transfer log | 0 |
| `quick_replies` | Canned responses | 5 |
| `working_hours` | Business hours config | 0 |
| `tickets` | Trouble tickets | 1 |
| `ticket_activities` | Ticket timeline | 2 |
| `notifications` | In-app/push notifications | 0 |
| `email_otps` | OTP codes | 0 |
| `refresh_tokens` | JWT refresh tokens | 0 |
| `audit_logs` | Change audit trail | 0 |
| `login_history` | Login access tracker | 0 |
| `company_settings` | KV settings store | 0 |

---

## API Endpoint Catalog

### Summary by Module

| Module | Endpoints | Method Split |
|:---|:---|:---|
| Auth | 8 | 1 GET, 7 POST |
| Tenant | 6 | 3 GET, 3 PUT |
| Branch | 5 | 2 GET, 1 POST, 1 PUT, 1 DELETE |
| Customer | 10 | 8 GET, 1 POST, 1 PUT |
| Portal (Customer Self-Care) | 7 | 5 GET, 1 POST, 1 PUT |
| RBAC | 9 | 4 GET, 2 POST, 2 PUT, 1 DELETE |
| User | 5 | 2 GET, 1 POST, 1 PUT, 1 DELETE |
| Ticket | 9 | 3 GET, 4 POST, 2 PUT |
| Chat (REST) | 9 | 4 GET, 2 POST, 1 PUT, 2 DELETE |
| Notification | 4 | 1 GET, 2 PUT, 1 DELETE |
| File | 4 | 1 GET, 2 POST, 1 DELETE |
| Audit | 3 | 3 GET |
| Report | 6 | 6 GET |
| Platform | 7 | 3 GET, 1 POST, 2 PUT, 1 GET |
| **Total** | **~92** | |

---

## WebSocket Event Catalog

| Direction | Events | Count |
|:---|:---|:---|
| Client to Server | `chat:send_message`, `chat:typing_start`, `chat:typing_stop`, `chat:mark_read`, `chat:assign`, `presence:heartbeat` | 6 |
| Server to Client | `chat:new_message`, `chat:message_delivered`, `chat:message_read`, `chat:typing`, `conversation:new`, `conversation:assigned`, `conversation:transfer`, `conversation:close`, `presence:update`, `notification:new` | 10 |
| **Total** | | **16** |

---

## Environment Variables

```env
# Runtime
NODE_ENV=development
PORT=4000
API_PREFIX=/api/v1
FRONTEND_URL=http://localhost:3000

# PostgreSQL
DATABASE_URL=postgresql://primeone_user:securepassword123@localhost:5432/primeone

# Redis
REDIS_URL=redis://:secureredispass123@localhost:6379

# JWT
JWT_ACCESS_SECRET=<64-char-entropy>
JWT_REFRESH_SECRET=<64-char-entropy>
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# File Storage (Cloudflare R2 / AWS S3)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=primeone-media

# Notifications
FCM_SERVER_KEY=
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=
SMTP_PASS=
SMTP_FROM="Prime One <noreply@primeone.io>"
```

---

## Deployment & DevOps

### Local Development Setup

```bash
# 1. Start PostgreSQL + Redis via Docker/Podman
podman-compose up -d

# 2. Push schema to database
cd backend && npm run db:push

# 3. Seed demo data
npm run db:seed

# 4. Start dev server
npm run start:dev
```

### Production Deployment

| Service | Recommendation |
|:---|:---|
| **Application** | Docker container on Railway / Fly.io / AWS ECS |
| **Database** | Managed PostgreSQL (Supabase / Neon / AWS RDS) |
| **Redis** | Managed Redis (Upstash / AWS ElastiCache) |
| **File Storage** | Cloudflare R2 (S3-compatible, zero egress fees) |
| **CI/CD** | GitHub Actions: Build, Test, Deploy |

---

## Testing Strategy

### Unit Tests

- Every service method tested with mocked Drizzle database.
- Permission resolution logic fully covered.
- JWT token generation and validation tested.

### Integration Tests (E2E)

- Full HTTP request lifecycle with Supertest.
- Multi-tenant isolation verification (Tenant A cannot access Tenant B data).
- RBAC enforcement across all protected endpoints.
- WebSocket connection, messaging, and room isolation.

### Commands

```bash
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

---

## Implementation Order (Recommended)

| Order | Module | Dependencies | Est. Time |
|:---|:---|:---|:---|
| 1 | Core Infrastructure (filters, interceptors, pipes) | None | 1 day |
| 2 | Auth Module + JWT Strategy + Guards + Decorators | Core | 2 days |
| 3 | Tenant Module | Auth | 1 day |
| 4 | Branch Module | Tenant | 0.5 day |
| 5 | User Module | Auth, Tenant | 1 day |
| 6 | RBAC Module | Auth, User | 1.5 days |
| 7 | Customer Module | Auth, Tenant, Branch | 1.5 days |
| 8 | Ticket Module + SLA Engine | Customer, BullMQ | 2 days |
| 9 | Chat REST + WebSocket Gateway | Customer, Auth, Redis | 2.5 days |
| 10 | Notification Module | BullMQ, Redis | 1 day |
| 11 | File Module | S3/R2 | 0.5 day |
| 12 | Audit Module | Core Interceptor | 0.5 day |
| 13 | Report Module | All domain modules | 1 day |
| 14 | Platform Module | Tenant, Auth | 1 day |
| 15 | Integration Connectors | Customer (360 degree) | 2 days |
| | **Total Estimated** | | **~18 days** |

---

> **Critical Rule**: All modules must be scaffolded using `npx @nestjs/cli g <schematic>` commands per the [ai-instructions.md](file:///c:/Users/Dev%20Ops/Videos/Projects/New%20CMS/backend/docs/ai-instructions.md) mandate. Manual file creation is prohibited to ensure automatic module wiring and dependency resolution.
