# Prime One - Project Overview

## 1. PROJECT VISION

**Prime One** is an enterprise-grade, modular, multi-tenant SaaS (Software as a Service) platform engineered specifically for Internet Service Providers (ISPs). The core objective of Prime One is to deliver a unified, modern, and highly scalable Customer Management & Operations Platform that streamlines the complex lifecycle of ISP operations—from customer acquisition and support to field engineering and network management.

### Immediate Scope & First Adopter
The platform's inaugural client is **Prime Networks**, an established ISP operating with:
- **20 branch locations**
- **12 helpdesk staff members**
- **40 field engineers**

### Long-Term Trajectory
Prime One is built with a long-term vision of supporting a vast ecosystem of ISPs. The architecture is designed to scale securely and efficiently to accommodate over **1 million users** across multiple distinct ISP companies. 

### Legacy Migration Strategy
Currently, many ISPs rely on legacy systems such as ZL Ultra for their CRM and billing needs. Prime One is strategically designed to replace these existing systems through a gradual, phased migration approach:
1. **Initial Integration**: Prime One will first integrate seamlessly with ZL Ultra via APIs to ensure uninterrupted service and data consistency.
2. **Progressive Dependency Shift**: Over time, modules and dependencies will be shifted fully onto Prime One.
3. **Full Independence**: Eventually, ISP companies will operate entirely within the Prime One ecosystem, sunsetting their reliance on legacy CRM software.

---

## 2. PRODUCT MODULES (Complete Platform Vision)

Prime One is not a monolithic application but a cohesive ecosystem composed of specialized, modular components. These modules will be built incrementally but integrated natively.

### 📱 Prime Chat
**Customer-Facing Mobile Application**
- **Platform**: iOS & Android (Built with Flutter)
- **Core Functionality**: Provides end-users with an intuitive portal for real-time chat with support, self-service troubleshooting, package information management, secure payments, and direct complaint logging. 

### 💻 Prime Desk
**Helpdesk & Administrative Web Portal**
- **Platform**: Web (Built with Next.js)
- **Core Functionality**: The command center for customer service representatives. It features a unified live chat inbox, a comprehensive "Customer 360°" view, robust case management, ticketing, and extensive operational reporting.

### 👷 Prime Field
**Field Technician Mobile Application**
- **Platform**: iOS & Android
- **Core Functionality**: Empowers field engineers with digital tools for optimal performance. Features include job assignments, live GPS tracking, QR/barcode scanning for asset deployment, digital Standard Operating Procedures (SOPs), interactive checklists, digital customer signatures, and a crucial offline mode for areas with poor connectivity.

### 📦 Prime Assets (formerly Prime Inventory)
**Comprehensive Resource Management**
- **Core Functionality**: End-to-end tracking of physical resources. Manages central warehouse inventory, engineer van stock, and network GIS assets. Utilizes QR/barcode scanning for precise asset tracking, fiber drum consumption monitoring, splitter management, and automated daily reconciliations.

### 🗺️ Prime NOC
**Network Operations Center Dashboard**
- **Core Functionality**: A real-time, high-level operational dashboard. Features a live geographic map displaying team locations, active field jobs, detected fiber outages, and daily performance metrics critical for network health monitoring.

### 🔌 Prime Connect
**Integration & Middleware Engine**
- **Core Functionality**: The nervous system connecting Prime One to the outside world. It houses dedicated connectors for legacy systems (ZL Ultra), network hardware management (MikroTik, SmartOLT), and external communication and financial gateways (SMS, WhatsApp, Payment Processors).

### 🧠 Prime AI
**Intelligent Operations Engine**
- **Core Functionality**: Leverages machine learning to optimize ISP operations. Features smart field dispatch routing, predictive maintenance alerts, fault pattern analysis, and deep performance analytics to proactively address network degradation before it impacts the customer.

---

## 3. PORTAL HIERARCHY (3 Levels)

The platform is structured across three distinct administrative tiers, ensuring proper governance, isolation, and control in a multi-tenant environment.

### Level 1: Platform Owner (Super Admin)
**The SaaS Operator**
- Responsible for the global management of the Prime One SaaS platform.
- Creates, onboards, and manages distinct ISP companies.
- Defines SaaS subscription plans, usage limits, and global billing.
- Accesses platform-wide aggregated analytics and system health metrics.
- Controls core system-wide settings and infrastructure configurations.

### Level 2: Company Owner (ISP Company Admin)
**The ISP Tenant Administrator**
- Exercises full authoritative control over their specific ISP instance.
- Manages company-wide branding (logos, nomenclature, color schemes, imagery) to ensure a white-labeled experience.
- Structures the organization by creating branches, departments, and teams.
- Employs the fully custom, permission-driven access model to define granular roles (no fixed roles exist).
- Dictates precisely what data and actions are available to specific staff members.
- Controls all company-level operational settings.

### Level 3: Company Staff (Helpdesk, Supervisors, Field Engineers, Accounts, etc.)
**The End-Users within the ISP**
- Operates strictly within the permission boundaries established by the Company Owner.
- Experiences a customized UI/UX based on their specific granted permissions (e.g., an accountant sees billing interfaces, a field engineer sees job queues).

---

## 4. RBAC & PERMISSIONS MODEL

Prime One discards rigid, traditional user roles in favor of a highly flexible, fully permission-driven architecture.

- **No Pre-Built Fixed Roles**: There are no hardcoded "Admin" or "Agent" roles. 
- **Custom Permission Groups**: The Company Owner constructs custom permission sets tailored to their unique organizational structure.
- **Hybrid Granularity**: Permissions are managed at both the **Module-level** (access to features) and the **Action-level** (specific capabilities within a feature).
  - *Example - Chat Module*: A staff member might be granted `Can View` ✅, `Can Send` ✅, and `Can Transfer` ✅, but explicitly denied `Can Delete` ❌.
- **Ubiquitous Control**: Every single feature, view, and action across the entire platform is gated by this robust permission engine.

---

## 5. MULTI-TENANCY MODEL

Security and data isolation are paramount for an enterprise SaaS platform hosting multiple competing businesses. Prime One utilizes a secure, robust multi-tenancy strategy.

- **Shared Database Architecture**: Operates on a single, highly optimized database structure where a `company_id` column exists on all relevant tables.
- **PostgreSQL Row-Level Security (RLS)**: Enforces strict database-level data isolation. RLS policies guarantee that database queries automatically filter data so a tenant can *only* ever access rows associated with their `company_id`.
- **API Security**: Each company is provisioned with a unique API Key and Secret.
- **Contextual JWTs**: JSON Web Tokens carry strict tenant context, ensuring all backend requests are authenticated and inherently bound to a specific company.
- **Defense in Depth**: Additional application-layer security measures are implemented to prevent any cross-tenant data spillage.
- **Unified Login Experience**: Users authenticate via a single, centralized domain. Upon successful authentication, the platform dynamically loads their specific company's branding, configuration, and data context.

---

## 6. INCREMENTAL DELIVERY STRATEGY

To minimize risk and accelerate time-to-market, Prime One is developed and deployed through a phased, module-by-module strategy.

### Phase 1 (Month 1-2): Communication & Chat
**Focus**: Establishing the core customer interaction layer.
- Launch of the **Prime Chat** customer mobile app (Flutter).
- Launch of the **Prime Desk** helpdesk web portal with live chat functionality.
- Implementation of the multi-tenant authentication system (Email OTP + Username/Password).
- Deployment of comprehensive chat capabilities: text, rich media (images, voice, video, documents), read receipts, and typing indicators.
- Workflow implementation for chat assignment, transferring (requiring a reason), closure (requiring an outcome), and customer rating.
- Support for internal communication via private notes, quick replies, and global chat history search.
- Implementation of staff working hours (online/offline scheduling logic).
- Deployment of Level 1 (Platform Owner) and Level 2 (Company Owner) administrative portals.
- Integration of Firebase Cloud Messaging (FCM) for push notifications.
- Full bilingual support (English + Urdu).
- Introduction of the "Customer 360°" view and the ability to seamlessly generate complaints directly from chat sessions.
- Rollout of baseline reports, analytics, and real-time supervisor monitoring tools.

### Phase 2 (Month 3-4): Ticketing & Case Management
**Focus**: Structuring workflows and managing physical interventions.
- Implementation of the **Interaction vs. Service Ticket Model**: Distinguishing routine contacts (Interactions) from scenarios requiring physical dispatch (Service Tickets).
- Launch of the unified **Job Engine**: Consolidating complaints, new installations, and infrastructure repairs into trackable 'Jobs' with definable sub-tasks.
- Deployment of the **SLA Engine**: Smart timers with automated escalation protocols for breached service levels.
- Introduction of digital Job SOPs and customizable checklists for field compliance.

### Phase 3 (Month 5-6): Payment & Billing
**Focus**: Financial workflows and legacy integration.
- Development of a robust Payment Queue featuring a strict verification workflow.
- Implementation of payment proof (screenshot) upload and manual/automated verification.
- Advanced algorithms for duplicate payment detection.
- Customer financial history via the Payment Timeline.
- Deep, bi-directional integration with the **ZL Ultra** billing API via Prime Connect.

### Phase 4 (Month 7+): Field Operations, Inventory, NOC
**Focus**: Outside Plant (OSP) management and advanced analytics.
- Full release of the **Prime Field** mobile application for engineers.
- Rollout of **Prime Assets** for granular warehouse, van stock, and QR-based item tracking.
- Launch of the real-time **Prime NOC** live geographic dashboard.
- Activation of the **Smart Dispatch Engine** (Prime AI) for route and assignment optimization.
- Hardware integrations via Prime Connect (MikroTik routers, SmartOLT infrastructure).

---

## 7. TECH STACK

Prime One is built on a modern, robust, and highly scalable technology stack.

- **Backend / API**: NestJS (TypeScript) utilizing a highly modular architecture.
- **ORM**: Drizzle ORM (ensuring strict type safety with zero runtime overhead).
- **Database**: PostgreSQL (enhanced with PostGIS extension for advanced GPS/GIS spatial queries).
- **Caching & Queues**: Redis, paired with BullMQ for reliable background job processing and scheduling.
- **Frontend (Web)**: Next.js (React) for high-performance server-side rendered administrative interfaces.
- **Mobile Applications**: Flutter (compiling to native Android and iOS).
- **Real-time Communication**: Socket.io / WebSockets for low-latency live chat and system updates.
- **File & Media Storage**: Cloudflare R2 (S3-compatible, cost-effective object storage).
- **Push Notifications**: Firebase Cloud Messaging (FCM).
- **Authentication**: Custom implementation utilizing Email OTP, Username/Password, and stateless JWTs.
- **Containerization**: Podman (daemonless container engine).
- **Networking/Security**: Cloudflare (SSL termination, CDN, and basic DDoS protection).
- **Deployment Infrastructure**: Initial deployment on local Ubuntu servers with static IPs, designed for seamless future migration to Cloud/VPS environments.

---

## 8. KEY BUSINESS RULES

The architecture and business logic of Prime One are governed by strict, unyielding operational rules designed to maintain data integrity and operational discipline.

1. **The Interaction Imperative**: *Every* contact initiated by a customer must be logged as a "Customer Interaction," regardless of the channel or outcome.
2. **The Dispatch Threshold**: "Service Tickets" are *only* generated when remote troubleshooting has definitively failed, or physical field work is explicitly required.
3. **Single Data Entry Policy**: Data must never be entered manually more than once. Prime Connect is responsible for ensuring automated synchronization across all interconnected systems.
4. **Absolute Asset Identity**: Every physical asset tracked by the system must possess a unique, scannable QR Code and a distinct Serial Number.
5. **The Scan-to-Install Mandate**: Field engineers are systematically blocked from recording a device installation without successfully scanning its corresponding QR code.
6. **Financial Prudence**: No customer payment can be officially posted or credited to an account without passing through the formal verification workflow.
7. **Strict Financial Linkage**: Every verified payment must be irrevocably linked to one (and only one) specific customer account.
8. **Comprehensive Accountability**: Every system action, configuration change, or data mutation is logged with a comprehensive, immutable audit trail identifying the user, timestamp, and context.

---

## 9. CUSTOMER COMMUNICATION CHANNELS

### Current (Legacy) State:
ISPs currently manage customer interactions across fragmented channels:
- Unstructured WhatsApp messages
- Phone Calls
- IVR Helplines
- Walk-in office visits

### Future (Prime One) State:
While legacy channels will be supported via Prime Connect integrations, **Prime Chat** (the in-app chat ecosystem) is strategically designed to replace and deprecate external dependencies like WhatsApp, consolidating all communication into a single, fully auditable, and rich proprietary channel.

---

## 10. TARGET COMPETITORS / REFERENCE

The primary incumbent and immediate reference point is **ZL Ultra**, the legacy CRM currently in use by the initial adopter. 

The ultimate strategic goal of Prime One is not mere parity, but overwhelming superiority. Prime One is designed to offer a vastly modernized, significantly faster, and significantly more feature-rich platform compared to ZL Ultra, specifically introducing capabilities entirely absent in legacy systems, such as native live chat, real-time GPS field tracking, AI-driven dispatch optimization, and strict, granular asset management.
