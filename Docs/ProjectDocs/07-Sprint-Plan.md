# Prime One: Sprint Plan & Development Roadmap

This document outlines the detailed development roadmap and week-by-week sprint plan for **Prime One**, a SaaS multi-tenant ISP CMS platform. The primary focus of Phase 1 is the launch of the Communication & Chat module within a 4 to 6-week timeframe, followed by subsequent phases to build out the entire platform.

---

## 1. Phase 1 Complete Feature List

The features for Phase 1 are categorized and prioritized to ensure a structured and achievable launch. 
Priority Levels:
*   **P0**: Must have for launch (Critical path).
*   **P1**: Important, but can be delivered as a fast-follow (1-2 weeks post-launch).
*   **P2**: Nice to have (Deferred to later phases).

### Infrastructure (P0)
*   **Podman Setup**: Containerization strategy for PostgreSQL and Redis to ensure consistent development and deployment environments.
*   **NestJS Project Scaffolding**: Initial setup using a modular, scalable architecture tailored for enterprise SaaS.
*   **Drizzle ORM Setup**: Integration of Drizzle ORM with PostgreSQL, including the establishment of a robust database migration system.
*   **Environment Configuration**: Implementation of dynamic, environment-based configuration management (dev, staging, prod).
*   **Next.js Project Setup**: Initialization of the web portal frontend application.
*   **Flutter Project Setup**: Initialization of the cross-platform mobile application for customers.

### Authentication (P0)
*   **User Registration**: Administrative creation of user accounts by the Company Owner.
*   **User Login**: Standard authentication using email and password for internal staff.
*   **Customer Registration**: Self-serve registration flow via the mobile application.
*   **Customer Login**: Standard authentication for customers via the mobile app.
*   **Email OTP System**: Implementation of one-time passwords for verification processes.
*   **Token Management**: Secure generation and handling of JWT access tokens and refresh tokens.
*   **Session Management**: Implementation of secure logout and token revocation mechanisms.

### Multi-Tenancy (P0)
*   **Company Management**: CRUD operations for the core `Company` entity.
*   **Tenant Resolution**: Middleware logic to accurately extract and resolve the tenant ID from the incoming JWT.
*   **TenantGuard Middleware**: Security layer to ensure requests are appropriately scoped to the resolved tenant.
*   **Row-Level Security (RLS)**: PostgreSQL database-level policies to enforce strict data isolation between tenants.
*   **Company Branding Storage**: Mechanism to store and retrieve tenant-specific branding assets (logos, colors).

### Role-Based Access Control (RBAC) (P0)
*   **Permission Seeding**: Initial setup of comprehensive permission categories and specific permission nodes.
*   **Permission Groups**: CRUD operations for managing roles/groups (e.g., Admin, Agent, Supervisor).
*   **User Assignment**: Functionality to assign users to specific permission groups.
*   **PermissionGuard Decorator**: Implementation of a NestJS guard to protect endpoints based on required permissions.
*   **Enforcement Logic**: Core logic to evaluate a user's cumulative permissions against endpoint requirements.

### Real-time Chat Engine (P0)
*   **WebSocket Gateway**: Configuration of NestJS WebSocket gateway leveraging Socket.io.
*   **Redis Adapter**: Implementation of Socket.io Redis adapter to support horizontal scaling of WebSocket instances.
*   **Conversation Management**: API and WebSocket events for initiating conversations (Customer-to-Agent and Agent-to-Customer).
*   **Messaging Core**: Real-time transmission and reception of text messages.
*   **Message Persistence**: Asynchronous saving of chat messages to the PostgreSQL database to ensure durability.
*   **Inbox View**: Retrieval of the active chat list (conversations) for both agents and customers.
*   **Chat History**: Paginated retrieval of historical messages within a specific conversation.
*   **Presence System**: Tracking and broadcasting of online/offline status for users and customers.

### Advanced Chat Features (P1)
*   **Rich Media Support**: Upload, secure storage, and inline display of Images.
*   **Voice Notes**: Recording, upload, and playback of audio messages.
*   **Video Support**: Upload and inline playback of video clips.
*   **Document Handling**: Secure upload and download of standard document formats (PDF, DOCX).
*   **Read Receipts**: Granular message status tracking (Sent, Delivered, Read).
*   **Typing Indicators**: Real-time broadcasting of typing status.
*   **Routing & Assignment**: Logic to route and assign incoming customer chats to available agents.
*   **Chat Transfer**: Ability for an agent to transfer a chat to another agent or department, requiring a transfer reason.
*   **Chat Closure**: Mechanism to formally close a conversation, capturing a resolution outcome.
*   **Customer Rating**: Automated prompt for customers to rate the interaction upon chat closure.
*   **Private Notes**: Internal, agent-only notes attached to a conversation.
*   **Public Notes**: Notes attached to a conversation visible to the customer (if applicable based on workflow).
*   **Quick Replies**: Management and insertion of pre-defined template responses for agents.
*   **Chat Search**: Full-text search capabilities across message histories.
*   **Working Hours**: Configuration of online/offline schedules, automatically handling after-hours messaging.
*   **System Messages**: Automated inline notifications within the chat stream (e.g., "Agent joined", "Chat transferred").

### Portals - Web (P0)
*   **Platform Owner Portal**: 
    *   Secure Login.
    *   Global Company List.
    *   Interface to provision/create new companies (Tenants).
*   **Company Owner Portal**:
    *   Secure Login.
    *   High-level Dashboard.
    *   User Management (Staff provisioning).
    *   Permission & Role Management.
    *   Branding Settings configuration.
*   **Staff Agent Portal**:
    *   Secure Login.
    *   Chat Inbox (List of assigned and unassigned conversations).
    *   Active Conversation View.
    *   Core Send/Receive message interface.

### Portals - Web (P1)
*   **Company Owner Portal**:
    *   Configuration of global working hours.
    *   Management interface for Quick Replies/Templates.
*   **Staff Agent Portal**:
    *   UI support for full media rendering in chat.
    *   Interfaces for Chat Transfer, Closure, and Note-taking.
    *   **Customer 360° View**: A comprehensive sidebar showing customer details, history, and active context.
*   **Supervisor Portal**:
    *   Live monitoring of active agent chats.
    *   Agent performance metrics and status overview.
*   **Reporting**:
    *   Basic analytical reports detailing chat volume, resolution times, and agent activity.

### Mobile App - Flutter (P0)
*   **Customer Registration & Login**: Native UI flows for authentication.
*   **Chat Screen**: Primary interface for real-time text messaging.
*   **Conversation List**: Overview of all active and past chats for the customer.
*   **Push Notifications**: Integration with Firebase Cloud Messaging (FCM) for background alerts on new messages.

### Mobile App - Flutter (P1)
*   **Rich Media UI**: Interfaces for capturing, uploading, and viewing images, voice notes, videos, and documents.
*   **Real-time Indicators**: Visual implementation of read receipts and typing indicators.
*   **Customer Profile**: View and edit basic customer profile information.
*   **Rating Interface**: UI prompt to submit feedback post-chat closure.
*   **Localization**: Bilingual support, explicitly targeting English and Urdu.
*   **Offline Support**: Local caching of conversation lists and recent messages for offline viewing.

### Notifications (P1)
*   **FCM Integration**: Server-side logic to trigger push notifications for specific events.
*   **In-App Notifications**: A dedicated list/dropdown within the web and mobile apps for system alerts.
*   **Preferences**: User-configurable settings to toggle specific notification types.

---

## 2. Week-by-Week Sprint Plan (Phase 1)

This aggressive 6-week plan focuses on delivering the P0 core first, ensuring a stable foundation before layering on P1 polish.

### Week 1: Foundation
**Focus:** Infrastructure, Database Schema, and Core Security Modules.
*   **Day 1-2**: Establish Podman compose environment. Initialize PostgreSQL and Redis containers. Scaffold the NestJS backend and integrate Drizzle ORM.
*   **Day 3-4**: Implement the Authentication module (Registration, Login, JWT issuing, Refresh Token flow, Email OTP service).
*   **Day 5**: Develop the Multi-tenant core (Company CRUD, JWT-based tenant resolution middleware, PostgreSQL Row-Level Security policies).
*   **Day 6-7**: Build the RBAC module (Seed initial permission data, Group CRUD, User assignment, implement `PermissionGuard`).

### Week 2: Chat Engine
**Focus:** The real-time heart of the application.
*   **Day 1-2**: Set up the NestJS WebSocket gateway. Integrate Socket.io with the Redis adapter for scalability. Implement secure WebSocket connection authentication.
*   **Day 3-4**: Build backend logic for Conversation CRUD. Implement core message sending and receiving over WebSockets. Ensure robust persistence of messages to PostgreSQL.
*   **Day 5**: Implement basic routing and chat assignment logic. Define and manage conversation state machines (Open, Pending, Closed).
*   **Day 6-7**: Implement robust message pagination. Develop APIs for retrieving chat history. Build the online/offline presence tracking system.

### Week 3: Web Portal (Next.js)
**Focus:** Administrative and Agent interfaces.
*   **Day 1-2**: Initialize Next.js project. Construct base application layouts. Build Auth pages (Login, Password Reset).
*   **Day 3-4**: Develop the Platform Owner portal (specifically the interface to manage and create tenant companies).
*   **Day 5-6**: Develop the Company Owner portal (interfaces for managing staff users, assigning permissions, and configuring branding).
*   **Day 7**: Build the initial Staff Agent chat interface (Conversation list sidebar + active chat view).

### Week 4: Mobile App (Flutter)
**Focus:** Customer-facing application.
*   **Day 1-2**: Initialize Flutter project. Build native authentication screens (Login, Register).
*   **Day 3-4**: Develop the primary Chat screen (UI for real-time messaging, connecting to the WebSocket gateway).
*   **Day 5**: Build the Conversation list view. Integrate basic Push Notifications (FCM) to receive alerts when the app is backgrounded.
*   **Day 6-7**: Conduct initial end-to-end testing between Mobile and Backend. Fix critical bugs. Prepare initial internal deployment (APK).

### Week 5: Polish & Advanced Features (P1)
**Focus:** Enhancing the core experience with P1 features.
*   **Day 1-2**: Implement Media uploads across backend (storage logic) and both frontends (Images, Voice, Video, Documents).
*   **Day 3**: Implement Read Receipts and Typing Indicators (backend events + UI integration).
*   **Day 4**: Build workflows for Chat Transfer, Chat Closure (with outcomes), and the Customer Rating prompt.
*   **Day 5**: Implement Private/Public Notes functionality and the Quick Replies system.
*   **Day 6**: Build the Working Hours configuration and enforce it. Implement backend and UI for Chat Search.
*   **Day 7**: Develop the basic Customer 360° view in the Agent portal.

### Week 6: Launch Preparation
**Focus:** Finalizing operations, translation, testing, and deployment.
*   **Day 1-2**: Build basic Reporting dashboards (chat stats, volume).
*   **Day 3**: Develop the Supervisor monitoring view.
*   **Day 4**: Implement bilingual support (Urdu translation files in web and mobile).
*   **Day 5-6**: Comprehensive End-to-End Testing (UAT). Conduct a focused security review (checking RLS and RBAC enforcement).
*   **Day 7**: Production Deployment to Ubuntu server environment. Final sanity checks.

---

## 3. Phase 2 Roadmap (Month 3-4)
**Focus:** Expanding from generic chat to structured service management.

*   **Interaction vs Service Ticket Model**: Transitioning conversations into structured, trackable tickets.
*   **Job Engine**: Introduction of specific workflow types (Complaint, Installation, Repair).
*   **SLA Management**: Implementing Service Level Agreement timers with automated, smart escalation paths based on ticket priority.
*   **Ticket Sub-tasks**: Allowing complex jobs to be broken down into trackable sub-tasks.
*   **SOPs & Digital Checklists**: Enforcing Standard Operating Procedures via mandatory digital checklists attached to specific Job types.
*   **Priority Rules Engine**: Automated prioritization logic (e.g., Premium Customer Class + Outage Complaint Type = Automatic High Priority).

---

## 4. Phase 3 Roadmap (Month 5-6)
**Focus:** Financial operations and billing integration.

*   **Payment Queue**: A structured workflow for verifying incoming payments.
*   **Proof of Payment**: Support for customers to upload payment screenshots for manual verification.
*   **Duplicate Detection**: System logic to flag potentially duplicate payment submissions.
*   **Payment Timeline**: A transparent audit trail of a customer's payment history.
*   **Billing API Integration**: Deep integration with billing systems (specifically ZL Ultra API).
*   **Self-Recharge Flow**: Allowing customers to automatically renew or recharge services directly via the mobile app.

---

## 5. Phase 4 Roadmap (Month 7+)
**Focus:** Field Operations and Asset Management.

*   **Prime Field App**: A dedicated mobile application for field technicians featuring GPS tracking, QR code scanning, and robust offline mode capabilities.
*   **Prime Assets**: Comprehensive inventory and asset management (Warehouse stock, Van stock, Fiber tracking, QR-based asset lifecycle tracking).
*   **Prime NOC (Network Operations Center)**: A real-time, live map and operations dashboard for tracking field teams and network status.
*   **Smart Dispatch Engine**: Automated dispatch logic to assign jobs to the nearest field team based on location and capacity scoring.
*   **Network Integrations**: Direct integrations with network hardware (MikroTik, SmartOLT) for automated provisioning and diagnostics.

---

## 6. Definition of Done (DoD)

A feature is strictly considered complete only when all the following criteria are met:
1.  **Code Complete**: All required code is written and has passed peer review (or self-review if solo, against strict standards).
2.  **API Tested**: Backend API endpoints are tested (Postman/automated tests) and function as expected.
3.  **UI Functional**: Frontend (Web) and Mobile UIs are fully functional and accurately consume the respective APIs.
4.  **Multi-Tenant Isolation**: The feature has been explicitly tested to ensure zero data leakage between distinct company tenants.
5.  **RBAC Enforced**: Permission checks are correctly implemented and verified (unauthorized roles are successfully blocked).
6.  **Error Handling**: Robust error handling is implemented on both backend (meaningful HTTP codes) and frontend (graceful UI degradation/alerts).
7.  **Documentation**: Basic technical documentation (e.g., API swagger/Markdown notes) exists for future reference.

---

## 7. Risk Assessment

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Solo developer burnout** | High | Adhere strictly to the prioritized feature list. Do not attempt P1/P2 features until all P0 features are verified stable. Build in buffer time. |
| **1-month timeline too aggressive** | Medium | Utilize the "Phase within a Phase" approach. Launch the absolute bare minimum (P0) first. Treat P1 as a subsequent fast-follow release. |
| **WebSocket scaling complexity** | Medium | Utilize `Socket.io` rather than raw WebSockets. It is battle-tested and handles reconnection logic. Rely on the Redis adapter from Day 1 to ensure horizontal scalability is possible later without rewrites. |
| **Multi-tenancy bugs (Data Leakage)** | High | Heavily rely on PostgreSQL Row-Level Security (RLS) as the ultimate safety net. Implement automated integration tests specifically designed to verify tenant isolation. |
| **Mobile App Store Review Delays** | Low | Plan for direct APK distribution for initial beta testing and immediate usage. Submit to Google Play Store early in the process to account for review times. |

---

## 8. Success Metrics for Phase 1 Launch

The Phase 1 launch will be deemed successful if the following technical and operational metrics are met in the production environment:

*   **Core Flow Success**: Customers can successfully register, login, and initiate a real-time chat with an agent.
*   **Agent Capability**: Helpdesk agents can seamlessly manage multiple concurrent conversations without UI lag or state confusion.
*   **Latency**: Real-time text messages are delivered end-to-end in `< 500ms`.
*   **Data Integrity**: Chat history loads accurately and in the correct order for both parties upon reconnection or page refresh.
*   **Reliability**: Push notifications trigger reliably on Android devices when the app is in the background.
*   **Platform Operations**: The Platform Owner can successfully provision new isolated companies (tenants) via the UI.
*   **Tenant Administration**: Company Owners can successfully invite staff and manage their RBAC permissions.
*   **Security Verification**: Absolute zero cross-tenant data leakage is observed.

---
*Document Version: 1.0.0*
