# Prime One - API Design & Endpoints

## 1. API Design Principles

- **Architecture:** RESTful API
- **Versioning:** `/api/v1/`
- **Authentication:** Bearer JWT Token (`Authorization: Bearer <token>`)
- **Multi-tenancy:** Every request is automatically scoped to the authenticated user's company (tenant) based on the JWT token.
- **Pagination:**
  - Cursor-based for real-time lists (e.g., chat messages).
  - Offset-based for standard lists (e.g., users, customers, audit logs).
- **Rate Limiting:** Implemented per tenant and per user to prevent abuse.
- **File Uploads:** `multipart/form-data` for endpoints handling files.

### 1.1 Response Format

All successful API responses follow a standardized envelope:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

- `data`: The requested resource(s).
- `meta`: Optional pagination or extra metadata.

### 1.2 Error Format

All error responses return an appropriate HTTP status code (4xx, 5xx) with the following body:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  }
}
```

---

## 2. Detailed Endpoint Specifications

### 2.1 Authentication APIs

#### 2.1.1 Staff Login
**POST** `/api/v1/auth/login`

Authenticates a staff user and returns JWT tokens.

- **Permissions:** None (Public)
- **Headers:** `Content-Type: application/json`

**Request Body**
```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

**Response Body**
```typescript
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    companyId: string;
    permissions: string[];
  }
}
```

**Possible Errors:**
- `401 UNAUTHORIZED`: `INVALID_CREDENTIALS`, `ACCOUNT_DISABLED`
- `400 BAD_REQUEST`: `VALIDATION_ERROR`

#### 2.1.2 Staff Registration
**POST** `/api/v1/auth/register`

Registers a new staff member. Typically used by company owners.

- **Permissions:** `users:create`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`

**Request Body**
```typescript
interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  branchId?: string;
}
```

**Response Body**
```typescript
interface RegisterResponse {
  id: string;
  email: string;
  status: 'pending_activation' | 'active';
}
```

**Possible Errors:**
- `400 BAD_REQUEST`: `VALIDATION_ERROR`, `EMAIL_ALREADY_EXISTS`
- `403 FORBIDDEN`: `INSUFFICIENT_PERMISSIONS`

---

### 2.2 Chat & Conversation APIs

#### 2.2.1 Create Conversation
**POST** `/api/v1/conversations`

Starts a new chat conversation.

- **Permissions:** `conversations:create`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`

**Request Body**
```typescript
interface CreateConversationRequest {
  customerId: string;
  subject?: string;
  initialMessage?: string;
}
```

**Response Body**
```typescript
interface ConversationResponse {
  id: string;
  status: 'open' | 'waiting' | 'closed';
  customerId: string;
  agentId?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Possible Errors:**
- `404 NOT_FOUND`: `CUSTOMER_NOT_FOUND`
- `400 BAD_REQUEST`: `VALIDATION_ERROR`

#### 2.2.2 Send Message
**POST** `/api/v1/conversations/:id/messages`

Sends a message in a conversation.

- **Permissions:** `conversations:reply`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`

**Request Body**
```typescript
interface SendMessageRequest {
  content: string;
  type: 'text' | 'image' | 'file';
  fileId?: string;
}
```

**Response Body**
```typescript
interface MessageResponse {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'agent' | 'customer' | 'system';
  content: string;
  type: string;
  createdAt: string;
}
```

#### 2.2.3 Transfer Conversation
**POST** `/api/v1/conversations/:id/transfer`

Transfers a conversation to another agent or department.

- **Permissions:** `conversations:transfer`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`

**Request Body**
```typescript
interface TransferRequest {
  targetAgentId?: string;
  targetDepartmentId?: string;
  reason: string;
}
```

**Response Body**
```typescript
interface TransferResponse {
  conversationId: string;
  status: 'waiting' | 'open';
  assignedAgentId?: string;
}
```

#### 2.2.4 Close Conversation
**POST** `/api/v1/conversations/:id/close`

Closes an active conversation.

- **Permissions:** `conversations:close`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`

**Request Body**
```typescript
interface CloseConversationRequest {
  outcome: 'resolved' | 'unresolved' | 'spam';
  notes?: string;
}
```

**Response Body**
```typescript
interface CloseConversationResponse {
  conversationId: string;
  status: 'closed';
  closedAt: string;
}
```

---

### 2.3 User Management APIs (Staff)

#### 2.3.1 Create User
**POST** `/api/v1/users`

Creates a new internal staff user.

- **Permissions:** `users:create`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`

**Request Body**
```typescript
interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  branchId?: string;
  permissionGroupIds: string[];
}
```

**Response Body**
```typescript
interface UserResponse {
  id: string;
  email: string;
  status: 'active' | 'inactive';
}
```

#### 2.3.2 Get Users
**GET** `/api/v1/users`

Lists staff users with filtering and pagination.

- **Permissions:** `users:read`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:** `page`, `limit`, `search`, `branchId`, `status`

**Response Body**
```typescript
interface ListUsersResponse {
  users: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    status: 'active' | 'inactive';
    lastLoginAt: string;
  }>;
}
```

---

### 2.4 Customer Management APIs

#### 2.4.1 Create Customer
**POST** `/api/v1/customers`

Registers a new end customer.

- **Permissions:** `customers:create`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`

**Request Body**
```typescript
interface CreateCustomerRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  customerCode?: string;
  packageId?: string;
}
```

**Response Body**
```typescript
interface CustomerResponse {
  id: string;
  firstName: string;
  lastName: string;
  customerCode: string;
}
```

#### 2.4.2 Get Customer 360 View
**GET** `/api/v1/customers/:id/360`

Retrieves full aggregated details of a customer including active plans, billing status, and recent interactions.

- **Permissions:** `customers:read`
- **Headers:** `Authorization: Bearer <token>`

**Response Body**
```typescript
interface Customer360Response {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    customerCode: string;
  };
  activeSubscriptions: Array<{
    planName: string;
    status: string;
    expiresAt: string;
  }>;
  recentConversations: Array<{
    id: string;
    subject: string;
    status: string;
    createdAt: string;
  }>;
  billingStatus: 'active' | 'suspended' | 'grace_period';
}
```

---

### 2.5 Permission Management APIs

#### 2.5.1 Create Permission Group
**POST** `/api/v1/permission-groups`

Creates a new group/role with specific permissions.

- **Permissions:** `roles:create`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`

**Request Body**
```typescript
interface CreatePermissionGroupRequest {
  name: string;
  description?: string;
  permissions: string[]; // array of permission slugs
}
```

**Response Body**
```typescript
interface PermissionGroupResponse {
  id: string;
  name: string;
  permissionsCount: number;
}
```

#### 2.5.2 Assign Permissions to Group
**PUT** `/api/v1/permission-groups/:id/permissions`

Updates the permissions for a specific group.

- **Permissions:** `roles:update`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`

**Request Body**
```typescript
interface AssignPermissionsRequest {
  permissions: string[];
}
```

---

### 2.6 File Upload APIs

#### 2.6.1 Upload File
**POST** `/api/v1/files/upload`

Uploads a file to cloud storage (e.g., Cloudflare R2 / AWS S3) and returns the file metadata and CDN URL.

- **Permissions:** `files:upload`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`

**Request Body**
`file`: Binary file data (multipart)

**Response Body**
```typescript
interface FileUploadResponse {
  id: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
}
```

**Possible Errors:**
- `413 PAYLOAD_TOO_LARGE`: `FILE_TOO_LARGE`
- `415 UNSUPPORTED_MEDIA_TYPE`: `INVALID_FILE_TYPE`

---

## 3. Full Endpoint Reference Catalog

### Platform Owner APIs (Super Admin)
- `POST   /api/v1/platform/auth/login`
- `GET    /api/v1/platform/companies`
- `POST   /api/v1/platform/companies`
- `GET    /api/v1/platform/companies/:id`
- `PATCH  /api/v1/platform/companies/:id`
- `DELETE /api/v1/platform/companies/:id`
- `POST   /api/v1/platform/companies/:id/activate`
- `POST   /api/v1/platform/companies/:id/deactivate`
- `GET    /api/v1/platform/analytics/overview`

### Authentication APIs
- `POST   /api/v1/auth/register`
- `POST   /api/v1/auth/login`
- `POST   /api/v1/auth/otp/send`
- `POST   /api/v1/auth/otp/verify`
- `POST   /api/v1/auth/refresh-token`
- `POST   /api/v1/auth/logout`
- `POST   /api/v1/auth/forgot-password`
- `POST   /api/v1/auth/reset-password`
- `GET    /api/v1/auth/me`
- `PATCH  /api/v1/auth/me`

### Customer Auth APIs (Mobile App)
- `POST   /api/v1/customer/auth/register`
- `POST   /api/v1/customer/auth/login`
- `POST   /api/v1/customer/auth/otp/send`
- `POST   /api/v1/customer/auth/otp/verify`
- `POST   /api/v1/customer/auth/refresh-token`
- `POST   /api/v1/customer/auth/logout`
- `GET    /api/v1/customer/auth/me`
- `PATCH  /api/v1/customer/auth/me`

### Company Management APIs
- `GET    /api/v1/company/profile`
- `PATCH  /api/v1/company/profile`
- `PATCH  /api/v1/company/branding`
- `GET    /api/v1/company/settings`
- `PATCH  /api/v1/company/settings`
- `GET    /api/v1/company/working-hours`
- `PUT    /api/v1/company/working-hours`

### Branch APIs
- `GET    /api/v1/branches`
- `POST   /api/v1/branches`
- `GET    /api/v1/branches/:id`
- `PATCH  /api/v1/branches/:id`
- `DELETE /api/v1/branches/:id`

### User Management APIs (Staff)
- `GET    /api/v1/users`
- `POST   /api/v1/users`
- `GET    /api/v1/users/:id`
- `PATCH  /api/v1/users/:id`
- `DELETE /api/v1/users/:id`
- `POST   /api/v1/users/:id/activate`
- `POST   /api/v1/users/:id/deactivate`
- `GET    /api/v1/users/:id/permissions`
- `PUT    /api/v1/users/:id/permission-groups`
- `PUT    /api/v1/users/:id/permission-overrides`
- `GET    /api/v1/users/online`

### Customer Management APIs
- `GET    /api/v1/customers`
- `POST   /api/v1/customers`
- `GET    /api/v1/customers/:id`
- `PATCH  /api/v1/customers/:id`
- `DELETE /api/v1/customers/:id`
- `GET    /api/v1/customers/:id/360`
- `GET    /api/v1/customers/:id/conversations`
- `GET    /api/v1/customers/:id/interactions`
- `GET    /api/v1/customers/search?q=`

### RBAC / Permission APIs
- `GET    /api/v1/permissions`
- `GET    /api/v1/permissions/categories`
- `GET    /api/v1/permission-groups`
- `POST   /api/v1/permission-groups`
- `GET    /api/v1/permission-groups/:id`
- `PATCH  /api/v1/permission-groups/:id`
- `DELETE /api/v1/permission-groups/:id`
- `PUT    /api/v1/permission-groups/:id/permissions`
- `GET    /api/v1/permission-groups/:id/users`

### Chat / Conversation APIs
- `GET    /api/v1/conversations`
- `POST   /api/v1/conversations`
- `GET    /api/v1/conversations/:id`
- `PATCH  /api/v1/conversations/:id`
- `POST   /api/v1/conversations/:id/assign`
- `POST   /api/v1/conversations/:id/transfer`
- `POST   /api/v1/conversations/:id/close`
- `POST   /api/v1/conversations/:id/reopen`
- `POST   /api/v1/conversations/:id/rate`
- `GET    /api/v1/conversations/:id/messages`
- `GET    /api/v1/conversations/:id/messages/search?q=`
- `GET    /api/v1/conversations/:id/transfers`
- `GET    /api/v1/conversations/waiting`
- `GET    /api/v1/conversations/stats`

### Customer Chat APIs (Mobile App)
- `GET    /api/v1/customer/conversations`
- `POST   /api/v1/customer/conversations`
- `GET    /api/v1/customer/conversations/:id/messages`
- `POST   /api/v1/customer/conversations/:id/close`
- `POST   /api/v1/customer/conversations/:id/rate`
- `GET    /api/v1/customer/profile`

### File Upload APIs
- `POST   /api/v1/files/upload`
- `GET    /api/v1/files/:id`
- `DELETE /api/v1/files/:id`

### Quick Reply APIs
- `GET    /api/v1/quick-replies`
- `POST   /api/v1/quick-replies`
- `PATCH  /api/v1/quick-replies/:id`
- `DELETE /api/v1/quick-replies/:id`

### Notification APIs
- `GET    /api/v1/notifications`
- `PATCH  /api/v1/notifications/:id/read`
- `POST   /api/v1/notifications/read-all`
- `GET    /api/v1/notifications/unread-count`

### Audit Log APIs
- `GET    /api/v1/audit-logs`
- `GET    /api/v1/audit-logs/:entityType/:entityId`
- `GET    /api/v1/login-history`

### Report APIs
- `GET    /api/v1/reports/chat/summary`
- `GET    /api/v1/reports/chat/agents`
- `GET    /api/v1/reports/chat/ratings`
- `GET    /api/v1/reports/chat/timeline`
