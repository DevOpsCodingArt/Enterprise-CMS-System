# Technical Architecture: Prime One

**Prime One** is a SaaS multi-tenant ISP Customer Management System (CMS) platform designed to handle complex telecom operations, real-time communications, and multi-tenant billing/provisioning.

## Tech Stack Summary

*   **Backend:** NestJS (TypeScript)
*   **ORM:** Drizzle ORM
*   **Database:** PostgreSQL (with PostGIS extension for GPS/GIS)
*   **Cache & Queues:** Redis + BullMQ
*   **Frontend Web Portal:** Next.js (React, Tailwind CSS)
*   **Mobile Apps:** Flutter (Android + iOS)
*   **Real-time Engine:** Socket.io over WebSockets
*   **File Storage:** Cloudflare R2
*   **Push Notifications:** Firebase Cloud Messaging (FCM)
*   **Email Service:** Generic SMTP (For OTP-based authentication & alerts)
*   **Containerization:** Podman (with podman-compose)
*   **SSL/CDN/Security:** Cloudflare (Free Plan)
*   **Deployment:** Ubuntu server with static IP (Local first, cloud later)

---

## 1. System Architecture Overview

The system follows a modern decoupled microservices-ready architecture, centered around an API Gateway pattern using NestJS. 

```mermaid
architecture-beta
    group client(Client Layer)
    service web(Next.js Web Portal) in client
    service mob(Flutter Mobile App) in client

    group backend(Backend & API Layer)
    service api(NestJS API Gateway) in backend
    service ws(Socket.io Gateway) in backend
    service worker(BullMQ Workers) in backend

    group data(Data Layer)
    service db(PostgreSQL + PostGIS) in data
    service cache(Redis Cache & Queue) in data

    group external(External Integrations)
    service r2(Cloudflare R2 Storage) in external
    service fcm(Firebase Cloud Messaging) in external
    service email(SMTP Email) in external
    service mikrotik(MikroTik / SmartOLT) in external
    service zl(ZL Ultra API - Future) in external

    web --> api: REST / HTTP
    mob --> api: REST / HTTP
    web --> ws: WebSockets
    mob --> ws: WebSockets

    api --> db: Drizzle ORM
    api --> cache: Read/Write
    ws --> cache: Pub/Sub & Presence
    
    cache --> worker: Job Queue
    worker --> fcm: Push Notifications
    worker --> email: Send Emails
    worker --> db: Async Writes

    api --> r2: Pre-signed URLs / Uploads
    api --> mikrotik: Provisioning / Billing
    api --> zl: Sync
```

*   **Client Layer:** Both the Flutter app and Next.js portal consume a unified REST API for standard HTTP requests, and connect to a Socket.io server for real-time capabilities.
*   **API & Real-time Layer:** NestJS serves HTTP requests, enforces multi-tenancy rules via guards and interceptors, and exposes a Socket.io WebSocket interface.
*   **Data & Queue Layer:** PostgreSQL acts as the primary datastore, equipped with PostGIS for geo-spatial queries. Redis handles session states, caching, WebSocket pub/sub (for scaling), and queues (via BullMQ).
*   **Worker Layer:** Background workers process intensive tasks like email delivery, push notifications, SLA timeouts, and report generation asynchronously.

---

## 2. Backend Architecture (NestJS)

The backend employs a strictly modular domain-driven design structure. 

### Modules
*   **`AuthModule`**: Handles user login, registration, email OTP generation/verification, JWT signing, and refresh token rotation.
*   **`UserModule`**: Manages user management (staff, platform owners) and profile updates.
*   **`TenantModule`**: Handles multi-tenant management, company CRUD operations, billing plans, and tenant provisioning.
*   **`RBACModule`**: Manages permissions, permission groups (roles), and the hybrid module+action level authorization checks.
*   **`ChatModule`**: Core real-time messaging, containing the WebSocket Gateway, room management, and message persistence logic.
*   **`CustomerModule`**: Manages ISP customer profiles, providing a 360° view of customer data (billing, connections, location).
*   **`NotificationModule`**: Handles the dispatching of push notifications via FCM, real-time in-app alerts via WS, and transactional emails.
*   **`FileModule`**: Abstracts Cloudflare R2 operations, handling pre-signed URL generation, media processing (via workers), and upload validations.
*   **`AuditModule`**: Captures activity logs, audit trails, and data change histories.
*   **`IntegrationModule`**: Contains connectors for external systems (ZL Ultra API, MikroTik, SmartOLT).

### Component Anatomy
Each module consists of:
*   `*.controller.ts`: Defines REST endpoints and handles HTTP request/response formatting.
*   `*.gateway.ts`: (If real-time) Defines WebSocket message handlers and event emission.
*   `*.service.ts`: Contains core business logic.
*   `*.schema.ts`: Drizzle ORM table definitions and relations.
*   `*.dto.ts`: Data Transfer Objects with `class-validator` annotations for strict I/O validation.

### Cross-Cutting Concerns
*   **Guards:**
    *   `AuthGuard`: Validates JWT validity and signature.
    *   `TenantGuard`: Ensures the user belongs to the requested tenant context.
    *   `PermissionGuard`: Uses reflection to check if the user has the required action-level permissions for the endpoint.
*   **Interceptors:**
    *   `TenantInterceptor`: Automatically extracts `tenant_id` from the JWT or header and injects it into the request context for Drizzle ORM wrappers to consume.
    *   `AuditInterceptor`: Automatically logs request payloads, outcomes, and IP addresses to the audit log table.
*   **Middleware:**
    *   `RateLimitingMiddleware`: Enforces tenant-based API rate limits using Redis.
    *   `RequestLoggingMiddleware`: Logs access requests using Pino/Winston.

---

## 3. Real-time Architecture (WebSocket / Socket.io)

Real-time capabilities are driven by Socket.io, tightly integrated into NestJS using `@nestjs/websockets`.

*   **Scaling:** The `@nestjs/platform-socket.io` uses the Redis adapter. This allows multiple NestJS backend nodes to broadcast messages across the entire cluster seamlessly.
*   **Authentication:** The WebSocket Gateway uses an `OnGatewayConnection` lifecycle hook to intercept the incoming connection, extract the JWT from the `auth` payload or query string, and forcefully disconnect unauthorized sockets.
*   **Rooms Architecture:**
    *   *Per-company Room:* `tenant:${tenant_id}` (For global tenant broadcasts, e.g., config updates)
    *   *Per-user Room:* `user:${user_id}` (For private notifications and direct messages)
    *   *Per-conversation Room:* `chat:${conversation_id}` (For messages within a specific thread)

### Standardized WebSocket Events
*   `chat:message` - Send (Client -> Server) / Receive (Server -> Client) message payloads.
*   `chat:typing` - Broadcast typing indicator state (boolean).
*   `chat:read` - Broadcast read receipt (last read message ID).
*   `chat:delivered` - Broadcast delivery confirmation.
*   `chat:assignment` - Emitted when a chat thread is assigned to a specific staff member.
*   `chat:transfer` - Emitted when a chat is transferred, containing the transfer reason.
*   `chat:close` - Emitted when a chat is marked resolved, including the outcome code.
*   `user:online` / `user:offline` - Presence indicators (tracked via Redis sets).
*   `notification:push` - Generic event for in-app alert banners.

---

## 4. Multi-Tenancy Architecture

Prime One uses a **Single Database, Shared Schema** model with logically isolated data.

*   **Isolation Mechanism:** PostgreSQL **Row-Level Security (RLS)** is applied to all tenant-specific tables. Every table (except platform-level tables) contains a `company_id` column.
*   **Drizzle ORM Integration:** A custom query builder wrapper encapsulates standard Drizzle calls, automatically appending `.where(eq(schema.table.company_id, currentTenantId))` to all queries based on Request Context. When raw SQL is needed, RLS ensures safety by setting a local session variable `SET LOCAL app.current_tenant_id = '...'` at the start of the transaction.
*   **Tenant Resolution Flow:**
    1. Request arrives.
    2. `AuthGuard` extracts JWT.
    3. `TenantInterceptor` reads `tenant_id` from JWT payload.
    4. AsyncLocalStorage (ALS) stores the `tenant_id` for the lifespan of the request.
    5. Services and Repositories fetch `tenant_id` from ALS.
*   **API Security:** For external API access (e.g., integrations connecting to Prime One), tenants generate an API Key + Secret pair. The API gateway resolves the `tenant_id` from the provided API Key.

---

## 5. Authentication & Authorization Flow

The auth system handles distinct user scopes: Platform Admin vs. Tenant User.

*   **Registration/Login Flows:**
    *   **Email + Password:** Standard flow.
    *   **Phone + Email OTP:** Magic link / OTP code flow for quick staff access.
*   **Tokens:** Uses short-lived JWT Access Tokens (e.g., 15m) and long-lived, rotatable Refresh Tokens stored securely in the database/Redis.
*   **JWT Payload Structure:**
    ```json
    {
      "sub": "user-uuid",
      "tid": "tenant-uuid",
      "type": "staff", // or "platform_owner", "company_owner"
      "iat": 1715424000,
      "exp": 1715424900
    }
    ```
    *(Note: Large permission arrays are excluded from JWTs to prevent bloat; permissions are cached in Redis against the user/role ID).*
*   **RBAC (Role-Based Access Control):**
    *   **Multi-level Hierarchy:** Platform Owner > Company Owner > Staff.
    *   **Permission Checks:** The `@RequirePermissions('chat:write', 'customer:read')` decorator checks the user's assigned permission groups (roles) against the endpoint's requirements.

---

## 6. File Storage Architecture

File storage leverages Cloudflare R2, providing an S3-compatible API with zero egress fees, crucial for a high-traffic CMS.

*   **Upload Flow (Direct-to-Cloud):**
    1. Client requests an upload URL from Backend, specifying file type and size.
    2. Backend validates permissions and file restrictions.
    3. Backend generates a short-lived **Pre-signed S3 PutObject URL**.
    4. Client uploads the file directly to Cloudflare R2 using the URL.
    5. Client notifies Backend of upload completion; Backend stores the R2 key in the database.
*   **Folder Structure in R2:**
    `/{tenant_id}/chat/{conversation_id}/{UUID}_{original_filename.ext}`
*   **Media Processing:** Heavy media processing (like generating thumbnails for video/images) is queued in BullMQ. A worker downloads the asset, processes it, uploads the derivative back to R2, and updates the database.
*   **Limits:** Enforced via Pre-signed URL metadata conditions and backend validation (e.g., Max Image: 10MB, Max Video: 50MB).

---

## 7. Notification Architecture

A decoupled notification system ensures reliability and speed.

*   **Dispatch Queue:** All notification requests are pushed to a Redis BullMQ queue (`notifications_queue`).
*   **Workers:**
    *   **FCM Worker:** Processes push notifications for mobile devices. Targets FCM tokens stored in user sessions.
    *   **Email Worker:** Formats HTML templates (using Handlebars/React Email) and sends via SMTP.
    *   **WebSocket Worker:** Emits real-time JSON payloads to active socket connections.
*   **Preferences:** The `UserModule` stores user preferences (e.g., `mute_email_alerts`, `push_only_mentions`), which the notification worker evaluates before dispatching.

---

## 8. Caching Strategy

Redis is utilized extensively across the platform for performance and state management.

1.  **WebSocket Adapter:** Multi-instance syncing for Socket.io.
2.  **Presence State:** Tracking online/offline users using Redis Sets (`sadd online_users:{tenant_id} {user_id}`).
3.  **Rate Limiting:** Sliding window counters for API abuse prevention.
4.  **Config Cache:** Frequently read, rarely modified data (e.g., Tenant active features, RBAC permission definitions).
5.  **Job Queues (BullMQ):** Managing background tasks, SLA breach timers, and retry logic.
6.  **OTP/Ephemeral Data:** Short-lived codes for email/SMS verifications with TTLs.

---

## 9. Project Directory Structure

Assuming a monorepo setup (e.g., Nx or Turborepo) or standardized separate repos. Here is the logical layout:

```text
prime-one/
├── backend/                  # NestJS Application
│   ├── src/
│   │   ├── core/             # Interceptors, filters, guards, decorators
│   │   ├── config/           # Environment and DB config
│   │   ├── db/               # Drizzle schemas, migrations, seeders
│   │   ├── modules/          # Domain modules (Auth, Tenant, Chat, etc.)
│   │   │   └── chat/
│   │   │       ├── chat.controller.ts
│   │   │       ├── chat.service.ts
│   │   │       ├── chat.gateway.ts
│   │   │       └── dto/
│   │   └── main.ts
│   ├── package.json
│   └── nest-cli.json
├── frontend/                 # Next.js Application
│   ├── src/
│   │   ├── app/              # App router pages (dashboard, login, etc.)
│   │   ├── components/       # Reusable React components (UI library)
│   │   ├── lib/              # API clients, hooks, utils
│   │   └── stores/           # Zustand / Redux state
│   ├── tailwind.config.ts
│   └── package.json
├── mobile/                   # Flutter Application
│   ├── lib/
│   │   ├── core/             # Networking, constants, themes
│   │   ├── features/         # Screen-based feature modules
│   │   └── main.dart
│   └── pubspec.yaml
└── infrastructure/           # DevOps and Deployment
    ├── podman/               # Container configs
    ├── nginx/                # Proxy configs (if applicable)
    └── podman-compose.yml
```

---

## 10. Podman Compose Setup

Production-ready local deployment using `podman-compose`.

```yaml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:15-3.3
    container_name: prime_one_db
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5432:5432"
    volumes:
      - pg_data:/var/lib/postgresql/data
    networks:
      - prime_network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: prime_one_redis
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - prime_network
    restart: unless-stopped

  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    container_name: prime_one_api
    depends_on:
      - postgres
      - redis
    environment:
      - NODE_ENV=production
      - PORT=${API_PORT:-3000}
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_USER=${DB_USER}
      - DB_PASSWORD=${DB_PASSWORD}
      - DB_NAME=${DB_NAME}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      # ... other env vars
    ports:
      - "${API_PORT:-3000}:${API_PORT:-3000}"
    networks:
      - prime_network
    restart: always

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: prime_one_web
    depends_on:
      - backend
    environment:
      - NEXT_PUBLIC_API_URL=https://api.primeone.com/v1
      - NEXT_PUBLIC_WS_URL=wss://api.primeone.com
    ports:
      - "${WEB_PORT:-3001}:3000"
    networks:
      - prime_network
    restart: always

volumes:
  pg_data:
  redis_data:

networks:
  prime_network:
    driver: bridge
```

---

## 11. Environment Variables

Below is the required `.env` schema for the backend application.

```env
# Application Core
NODE_ENV=development|production
PORT=3000
API_PREFIX=/api/v1
FRONTEND_URL=https://app.primeone.com

# Database (PostgreSQL + PostGIS)
DB_HOST=localhost
DB_PORT=5432
DB_USER=prime_admin
DB_PASSWORD=secure_password
DB_NAME=prime_one_db
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=secure_redis_pass

# Security & JWT
JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Cloudflare R2 Storage
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=r2_access_key
R2_SECRET_ACCESS_KEY=r2_secret_key
R2_BUCKET_NAME=prime-one-media
R2_PUBLIC_DEV_URL=https://pub-your_dev_r2_url.r2.dev

# Firebase Cloud Messaging
FCM_PROJECT_ID=prime-one-fcm
FCM_CLIENT_EMAIL=firebase-adminsdk@prime-one-fcm.iam.gserviceaccount.com
FCM_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Email SMTP
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@mg.primeone.com
SMTP_PASS=smtp_password
SMTP_FROM="Prime One Alerts <noreply@primeone.com>"
```

---

## 12. API Design Principles

The platform follows a strict, predictable RESTful JSON API format.

*   **Versioning:** URI versioning is enforced globally: `/api/v1/`.
*   **Authentication:** `Authorization: Bearer <JWT>` header required for private endpoints.
*   **Global Response Wrapper:** Every response adheres to a strict interface to standardize frontend parsing.
    ```json
    {
      "success": true,
      "data": { ... },
      "error": null,
      "meta": {
        "timestamp": "2024-05-11T12:00:00Z",
        "requestId": "req-12345"
      }
    }
    ```
*   **Error Handling:** Meaningful HTTP status codes (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests, 500 Internal Server Error) combined with specific internal application error codes inside the `error` object.
*   **Pagination:** Cursor-based pagination is preferred for performance on large datasets (especially chat history and audit logs), returning `nextCursor` in the `meta` object. Fallback to offset/limit pagination only for complex admin table views.
*   **Validation:** Utilizes NestJS `ValidationPipe` with `class-validator` to automatically throw 400 errors for malformed input payloads before they hit the controller logic.
*   **Idempotency:** Critical write operations (like billing charges or customer creation) require an `Idempotency-Key` header to prevent duplicate execution during network retries.
