Prime Networks
PrimeChat – Role-Based Requirements & Functionalities
Draft v1.0 | Customer, Helpdesk, and Field/Technical Roles

1. Customer Role
   ID Function Requirement
   CUS-001 Secure login and access to own account.
   CUS-002 View customer profile and service information.
   CUS-003 View current package information from ZL Ultra.
   CUS-004 Upload payment/recharge screenshot.
   CUS-005 Submit payment/recharge request.
   CUS-006 View payment/recharge status.
   CUS-007 Receive recharge completion notification.
   CUS-008 Initiate customer chat with Helpdesk.
   CUS-009 View chat/interactions history.
   CUS-010 Register service complaint/request.
   CUS-011 View complaint/ticket history.
   CUS-012 View ticket status.
   CUS-013 View internet usage/GB usage where available.
   CUS-014 Receive service and complaint notifications.
   CUS-015 Wi-Fi password change requirement reserved for Phase-2 via TR-069.
2. Helpdesk Staff Role
   ID Function Requirement
   HD-001 Incoming chats Receive customer-initiated chats in a central chat window.
   HD-002 Customer identification See username/account and identifying information.
   HD-003 Customer 360 Access relevant customer information from integrated systems.
   HD-004 Package/payment View package and payment status from ZL Ultra.
   HD-005 Network diagnostics View available MikroTik session, traffic and speed information.
   HD-006 ONU/OLT diagnostics View available ONU/OLT signal and status information.
   HD-007 Usage analytics View available usage/traffic information from MikroTik/BQN/DPI.
   HD-008 History View previous complaints, interactions and engineering notes.
   HD-009 Interaction record Create a Customer Interaction for each customer contact.
   HD-010 Remote troubleshooting Perform and record basic troubleshooting before ticket creation where applicable.
   HD-011 Chat assignment Assign chat to technical staff, field engineer or supervisor.
   HD-012 Assignment notification Assigned person receives application notification.
   HD-013 Ownership Maintain current owner of every chat.
   HD-014 Transfer Transfer chat with complete assignment history.
   HD-015 Internal notes Add internal comments/notes.
   HD-016 Ticket creation Create/link service ticket when field or advanced work is required.
   HD-017 Payment queue Payment screenshots appear in the relevant work queue.
   HD-018 Payment verification Verify payment and record/initiate recharge workflow.
   HD-019 Closure outcome Close chat only with a recorded outcome.
   HD-020 Audit Record assignment, transfer, comments, closure user and timestamps.
   HD-021 Escalation Escalate repeated/complex cases to supervisor, senior engineer or specialist team.
   HD-022 Repeated complaint Highlight repeated complaints and support escalation.
   HD-023 Complaint aging Dashboard shows complaints approaching configured time thresholds.
   HD-024 Area/VLAN analytics Show complaint concentration by area/VLAN/core where mapping exists.
3. Field / Technical Staff Role
   ID Function Requirement
   FT-001 Assigned cases Receive assigned chats/tickets.
   FT-002 Notifications Receive notification for newly assigned technical case.
   FT-003 Customer context View customer username, area and relevant service information.
   FT-004 Work details View task/work-order details.
   FT-005 Network context Access available technical/network information.
   FT-006 History View relevant complaint and engineering history.
   FT-007 Task status Update task progress/status.
   FT-008 Technical notes Add technical notes.
   FT-009 Evidence Upload photos/documents/evidence.
   FT-010 GPS Capture/update customer GPS during eligible field visits.
   FT-011 Resolution Record action performed and resolution.
   FT-012 Material usage Record material consumed where inventory integration is enabled.
   FT-013 Fiber work Record fiber repair/replacement activity where authorized.
   FT-014 Device replacement Record ONU/device replacement through authorized workflow.
   FT-015 Escalation Escalate configuration/advanced issues.
   FT-016 Task closure Complete/request closure according to configured rules.
   FT-017 Closure evidence Retain notes, evidence and timestamps.
   FT-018 Customer communication Communicate through assigned case/chat where permitted.
4. Cross-Role Chat Lifecycle
5. Customer initiates chat.
6. Helpdesk receives and identifies customer.
7. Customer Interaction is created.
8. Helpdesk performs basic remote troubleshooting.
9. If resolved, the interaction is closed with an outcome.
10. If specialist/field work is required, the case is assigned/transferred and/or a linked ticket is created.
11. Assigned technical user receives notification.
12. Technical user performs action and records status, notes and evidence.
13. Outcome is linked back to the originating interaction.
14. Authorized user closes the chat/ticket and the system records who, when and why.
15. Common Audit Requirements
    • Record chat creator and creation time.
    • Record ownership and every ownership change.
    • Record assignment, reassignment, transfer and escalation.
    • Record comments and important status changes.
    • Record linked ticket/work order/recharge.
    • Record closure user, timestamp and closure outcome.
16. Phase-2 / Future
    • Customer Wi-Fi password change through TR-069.
    • Expanded remote device configuration.
    • Advanced AI troubleshooting and root-cause suggestions.
    • Additional WhatsApp/SMS/email notification integrations.
