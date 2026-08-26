/**
 * Centralized Mock Database for Prime One Telecom OS
 * 
 * Provides mock data for multi-tenancy, authentication, branches,
 * helpdesk chat, optical telemetry, ticketing, and inventory.
 * 
 * When connecting to the live NestJS backend, these stores can easily be
 * swapped with React Query REST/WebSocket hooks.
 */

import type { UserProfile, UserRole } from "@/types/auth.types";
import type { TenantCompany, BranchOffice } from "@/types/tenant.types";
import type { Conversation, ChatMessage } from "@/types/chat.types";
import type { OpticalTelemetry } from "@/types/api.types";

export interface TroubleTicket {
  id: string;
  ticketNo: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  pppoeUsername: string;
  branchId: string;
  branchName: string;
  category: "Fiber Break" | "High Optical Attenuation" | "Router Fault" | "New Installation" | "Payment Dispute";
  priority: "Critical" | "High" | "Normal" | "Low";
  status: "Open" | "Assigned" | "In Progress" | "Resolved" | "Closed";
  assignedDepartments: string[];
  assignedEngineers: string[];
  ettrHours: number;
  slaExpiresAt: string;
  isSlaBreached: boolean;
  opticalRxDbm?: number;
  description: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  qrCode: string;
  serialNumber: string;
  model: string;
  type: "ONU / ONT" | "Dual-Band Router" | "Splitter 1:8" | "Fiber Patchcord" | "Fiber Cable Drum";
  status: "In Warehouse" | "Assigned to Van" | "Deployed at Customer" | "Faulty";
  custodianName: string;
  branchId: string;
  branchName: string;
}

// 1. MOCK TENANT COMPANY
export const MOCK_TENANT_COMPANY: TenantCompany = {
  id: "comp-prime-01",
  name: "Prime Networks Pakistan",
  slug: "prime-networks",
  subdomain: "primenetworks",
  status: "active",
  totalBranches: 20,
  totalSubscribers: 142850,
  features: {
    smartOlt: true,
    mikrotikRadius: true,
    zlUltraSync: true,
    omniChat: true,
    aiDiagnostics: true,
  },
  themeTokens: {
    primaryHex: "#1B2CC1",
    secondaryHex: "#7692FF",
  },
};

// 2. MOCK USERS & RBAC ROLES
export const MOCK_USERS: Record<UserRole, UserProfile> = {
  platform_owner: {
    id: "usr-platform-01",
    name: "SaaS Super Admin",
    email: "superadmin@primeone.saas",
    role: "platform_owner",
    department: "Executive",
    companyId: "comp-platform-root",
    permissions: ["*"],
    isOnline: true,
  },
  company_owner: {
    id: "usr-comp-01",
    name: "Tariq Mehmood (CEO)",
    email: "ceo@primenetworks.pk",
    role: "company_owner",
    department: "Management",
    companyId: "comp-prime-01",
    branchId: "br-isb-01",
    branchName: "Islamabad Blue Area (HQ)",
    permissions: ["company:*", "branches:*", "staff:*", "chat:*", "tickets:*", "billing:*", "noc:*"],
    isOnline: true,
  },
  branch_manager: {
    id: "usr-bm-01",
    name: "Khurram Shahzad (BM)",
    email: "manager.lhr@primenetworks.pk",
    role: "branch_manager",
    department: "Management",
    companyId: "comp-prime-01",
    branchId: "br-lhr-01",
    branchName: "Lahore Gulberg III",
    permissions: ["branches:read", "staff:manage", "chat:read", "chat:reply", "tickets:*", "inventory:van"],
    isOnline: true,
  },
  noc_engineer: {
    id: "usr-noc-01",
    name: "Zubair Ahmed (NOC Lead)",
    email: "noc.lead@primenetworks.pk",
    role: "noc_engineer",
    department: "NOC",
    companyId: "comp-prime-01",
    branchId: "br-isb-01",
    branchName: "Islamabad Blue Area (HQ)",
    permissions: ["noc:*", "olt:*", "radius:*", "tickets:create", "tickets:resolve"],
    isOnline: true,
  },
  helpdesk_agent: {
    id: "usr-csr-01",
    name: "Fatima Noor (CSR #03)",
    email: "fatima.noor@primenetworks.pk",
    role: "helpdesk_agent",
    department: "Helpdesk",
    companyId: "comp-prime-01",
    branchId: "br-isb-01",
    branchName: "Islamabad Blue Area (HQ)",
    permissions: ["chat:read", "chat:reply", "chat:transfer", "chat:close", "tickets:create", "customer:360"],
    isOnline: true,
  },
  field_engineer: {
    id: "usr-field-01",
    name: "Usman Ali (Fiber Splicer)",
    email: "usman.field@primenetworks.pk",
    role: "field_engineer",
    department: "Field Operations",
    companyId: "comp-prime-01",
    branchId: "br-isb-01",
    branchName: "Islamabad Blue Area (HQ)",
    permissions: ["field:jobs", "inventory:van", "tickets:update", "tickets:resolve"],
    isOnline: true,
  },
  accounts_officer: {
    id: "usr-acc-01",
    name: "Bilal Hassan (Billing Lead)",
    email: "billing@primenetworks.pk",
    role: "accounts_officer",
    department: "Accounts",
    companyId: "comp-prime-01",
    permissions: ["billing:*", "payments:verify", "invoices:generate"],
    isOnline: true,
  },
  customer: {
    id: "cus-99482",
    name: "Ahmed Malik",
    email: "ahmed.malik@gmail.com",
    role: "customer",
    companyId: "comp-prime-01",
    branchId: "br-isb-01",
    branchName: "Islamabad Blue Area",
    permissions: ["customer:chat", "customer:tickets", "customer:payments"],
    isOnline: true,
  },
};

// 3. MOCK 20 BRANCH OFFICES MATRIX
export const MOCK_BRANCHES: BranchOffice[] = [
  {
    id: "br-isb-01",
    companyId: "comp-prime-01",
    code: "ISB-HQ",
    name: "Islamabad Blue Area (HQ)",
    city: "Islamabad",
    address: "Plot 42, Blue Area, Jinnah Avenue, Islamabad",
    managerName: "Tariq Mehmood",
    managerPhone: "+92 300 5551101",
    totalStaff: 14,
    totalEngineers: 8,
    openTickets: 3,
    slaCompliancePercent: 99.8,
    subnets: ["10.240.10.0/24", "103.14.22.0/24"],
    isActive: true,
  },
  {
    id: "br-lhr-01",
    companyId: "comp-prime-01",
    code: "LHR-GLB",
    name: "Lahore Gulberg III",
    city: "Lahore",
    address: "Plaza 18, Main Boulevard, Gulberg III, Lahore",
    managerName: "Khurram Shahzad",
    managerPhone: "+92 321 5552202",
    totalStaff: 12,
    totalEngineers: 10,
    openTickets: 7,
    slaCompliancePercent: 99.2,
    subnets: ["10.240.20.0/24", "103.14.23.0/24"],
    isActive: true,
  },
  {
    id: "br-khi-01",
    companyId: "comp-prime-01",
    code: "KHI-CLF",
    name: "Karachi Clifton Hub",
    city: "Karachi",
    address: "Block 5, Clifton, Karachi",
    managerName: "Zubair Ahmed",
    managerPhone: "+92 333 5553303",
    totalStaff: 16,
    totalEngineers: 12,
    openTickets: 5,
    slaCompliancePercent: 99.5,
    subnets: ["10.240.30.0/24", "103.14.24.0/24"],
    isActive: true,
  },
  {
    id: "br-rwp-01",
    companyId: "comp-prime-01",
    code: "RWP-SDR",
    name: "Rawalpindi Saddar",
    city: "Rawalpindi",
    address: "The Mall, Saddar, Rawalpindi",
    managerName: "Naveed Aslam",
    managerPhone: "+92 301 5554404",
    totalStaff: 8,
    totalEngineers: 6,
    openTickets: 2,
    slaCompliancePercent: 100,
    subnets: ["10.240.40.0/24"],
    isActive: true,
  },
  {
    id: "br-pew-01",
    companyId: "comp-prime-01",
    code: "PEW-TWN",
    name: "Peshawar University Town",
    city: "Peshawar",
    address: "University Road, Peshawar",
    managerName: "Imran Khan",
    managerPhone: "+92 345 5555505",
    totalStaff: 6,
    totalEngineers: 4,
    openTickets: 4,
    slaCompliancePercent: 97.4,
    subnets: ["10.240.50.0/24"],
    isActive: true,
  },
  {
    id: "br-fsd-01",
    companyId: "comp-prime-01",
    code: "FSD-DGD",
    name: "Faisalabad D-Ground",
    city: "Faisalabad",
    address: "D-Ground Commercial Center, Faisalabad",
    managerName: "Asif Javed",
    managerPhone: "+92 302 5556606",
    totalStaff: 7,
    totalEngineers: 5,
    openTickets: 3,
    slaCompliancePercent: 98.6,
    subnets: ["10.240.60.0/24"],
    isActive: true,
  },
  {
    id: "br-mul-01",
    companyId: "comp-prime-01",
    code: "MUL-BOS",
    name: "Multan Bosan Road",
    city: "Multan",
    address: "Bosan Road, Multan",
    managerName: "Shahid Ali",
    managerPhone: "+92 303 5557707",
    totalStaff: 6,
    totalEngineers: 4,
    openTickets: 2,
    slaCompliancePercent: 99.1,
    subnets: ["10.240.70.0/24"],
    isActive: true,
  },
  {
    id: "br-qta-01",
    companyId: "comp-prime-01",
    code: "QTA-JNH",
    name: "Quetta Jinnah Road",
    city: "Quetta",
    address: "Jinnah Road, Quetta",
    managerName: "Habibullah Mengal",
    managerPhone: "+92 334 5558808",
    totalStaff: 5,
    totalEngineers: 3,
    openTickets: 1,
    slaCompliancePercent: 99.4,
    subnets: ["10.240.80.0/24"],
    isActive: true,
  },
];

// 4. MOCK CONVERSATIONS & CHAT STREAMS
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-01",
    companyId: "comp-prime-01",
    branchId: "br-isb-01",
    branchName: "Islamabad Blue Area",
    customerId: "cus-99482",
    customerName: "Ahmed Malik",
    customerPhone: "+92 300 1234567",
    customerAccountNo: "ACC-99482",
    pppoeUsername: "ahmed_malik_isb",
    status: "active",
    assignedAgentId: "usr-csr-01",
    assignedAgentName: "Fatima Noor",
    lastMessage: "Hello, my optical light is blinking red and the connection has dropped.",
    lastMessageAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    unreadCount: 0,
    channel: "whatsapp",
    slaExpiresAt: new Date(Date.now() + 18 * 60 * 1000).toISOString(),
    isSlaBreached: false,
    opticalRxDbm: -27.4,
  },
  {
    id: "conv-02",
    companyId: "comp-prime-01",
    branchId: "br-lhr-01",
    branchName: "Lahore Gulberg III",
    customerId: "cus-88310",
    customerName: "Zainab Bibi",
    customerPhone: "+92 321 9876543",
    customerAccountNo: "ACC-88310",
    pppoeUsername: "zainab_lhr_50m",
    status: "waiting",
    lastMessage: "My monthly bill is paid but the speed is restricted to 10Mbps instead of 50Mbps.",
    lastMessageAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    unreadCount: 2,
    channel: "mobile_app",
    slaExpiresAt: new Date(Date.now() + 8 * 60 * 1000).toISOString(),
    isSlaBreached: false,
    opticalRxDbm: -18.2,
  },
  {
    id: "conv-03",
    companyId: "comp-prime-01",
    branchId: "br-khi-01",
    branchName: "Karachi Clifton Hub",
    customerId: "cus-77120",
    customerName: "Kamran Akmal",
    customerPhone: "+92 333 4567890",
    customerAccountNo: "ACC-77120",
    pppoeUsername: "kamran_khi_100m",
    status: "closed",
    assignedAgentId: "usr-csr-01",
    assignedAgentName: "Fatima Noor",
    lastMessage: "Complaint resolved. Optical signal calibrated to -17.2 dBm nominal.",
    lastMessageAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    unreadCount: 0,
    channel: "web_chat",
    slaExpiresAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isSlaBreached: false,
    opticalRxDbm: -17.2,
  },
];

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  "conv-01": [
    {
      id: "msg-01",
      conversationId: "conv-01",
      senderId: "cus-99482",
      senderName: "Ahmed Malik",
      senderRole: "customer",
      content: "Hello, my optical light is blinking red and the internet connection has dropped since morning.",
      type: "text",
      status: "read",
      createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    },
    {
      id: "msg-02",
      conversationId: "conv-01",
      senderId: "sys-01",
      senderName: "Prime AI Radar",
      senderRole: "system",
      content: "⚡ Automated Diagnostic: Optical power dropped to -27.4 dBm on Splitter #4 (GPON 0/2/4). High fiber attenuation detected.",
      type: "system",
      status: "read",
      createdAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    },
    {
      id: "msg-03",
      conversationId: "conv-01",
      senderId: "usr-csr-01",
      senderName: "Fatima Noor",
      senderRole: "agent",
      content: "🔒 Note: Verified subscriber in SmartOLT. High physical drop confirmed. Dispatched field splicer.",
      type: "private_note",
      isPrivateNote: true,
      status: "read",
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    {
      id: "msg-04",
      conversationId: "conv-01",
      senderId: "usr-csr-01",
      senderName: "Fatima Noor",
      senderRole: "agent",
      content: "Hello Ahmed! We performed a remote optical scan on your OLT port. A high optical drop has been identified. We created Trouble Ticket #TK-8842 and dispatched Splicer Usman (Van #04) to your street.",
      type: "text",
      status: "delivered",
      createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    },
  ],
};

// 5. MOCK OLT FLEET & OPTICAL TELEMETRY
export const MOCK_OLT_FLEET: OpticalTelemetry[] = [
  {
    oltHostname: "OLT-ISB-CORE-01",
    ponPort: "GPON 0/2/4",
    onuSerial: "HWTC884291A",
    rxPowerDbm: -18.4,
    txPowerDbm: 2.3,
    temperatureC: 42.1,
    status: "optimal",
    lastPolledAt: new Date().toISOString(),
  },
  {
    oltHostname: "OLT-LHR-METRO-03",
    ponPort: "EPON 1/1/8",
    onuSerial: "ZTED114092B",
    rxPowerDbm: -24.8,
    txPowerDbm: 1.8,
    temperatureC: 48.6,
    status: "warning",
    lastPolledAt: new Date().toISOString(),
  },
  {
    oltHostname: "OLT-KHI-SOUTH-02",
    ponPort: "GPON 0/4/12",
    onuSerial: "FHTT339100C",
    rxPowerDbm: -17.2,
    txPowerDbm: 2.5,
    temperatureC: 39.4,
    status: "optimal",
    lastPolledAt: new Date().toISOString(),
  },
];

// 6. MOCK TROUBLE TICKETS
export const MOCK_TICKETS: TroubleTicket[] = [
  {
    id: "tkt-01",
    ticketNo: "TK-8842",
    customerId: "cus-99482",
    customerName: "Ahmed Malik",
    customerPhone: "+92 300 1234567",
    pppoeUsername: "ahmed_malik_isb",
    branchId: "br-isb-01",
    branchName: "Islamabad Blue Area (HQ)",
    category: "High Optical Attenuation",
    priority: "High",
    status: "In Progress",
    assignedDepartments: ["Field Operations", "NOC"],
    assignedEngineers: ["Usman Ali (Van #04)"],
    ettrHours: 4,
    slaExpiresAt: new Date(Date.now() + 3.5 * 3600 * 1000).toISOString(),
    isSlaBreached: false,
    opticalRxDbm: -27.4,
    description: "Optical power dropped from -18.4dBm to -27.4dBm on Splitter #4. Splicing required.",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "tkt-02",
    ticketNo: "TK-8841",
    customerId: "cus-88310",
    customerName: "Zainab Bibi",
    customerPhone: "+92 321 9876543",
    pppoeUsername: "zainab_lhr_50m",
    branchId: "br-lhr-01",
    branchName: "Lahore Gulberg III",
    category: "Payment Dispute",
    priority: "Normal",
    status: "Open",
    assignedDepartments: ["Accounts"],
    assignedEngineers: ["Bilal Hassan"],
    ettrHours: 2,
    slaExpiresAt: new Date(Date.now() + 1.2 * 3600 * 1000).toISOString(),
    isSlaBreached: false,
    opticalRxDbm: -18.2,
    description: "Paid bill screenshot uploaded via app. MikroTik profile pending 50M rate refresh.",
    createdAt: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
  },
];

// Central Mock Database Facade
export const mockDb = {
  tenantCompany: MOCK_TENANT_COMPANY,
  users: MOCK_USERS,
  branches: MOCK_BRANCHES,
  conversations: MOCK_CONVERSATIONS,
  messages: MOCK_MESSAGES,
  oltFleet: MOCK_OLT_FLEET,
  tickets: MOCK_TICKETS,
};
