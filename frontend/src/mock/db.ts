/**
 * Centralized Mock Database for Prime One Telecom OS
 * 
 * Provides typed data for multi-tenancy, authentication, branches,
 * helpdesk chat, optical telemetry, ticketing, subscribers, packages,
 * workforce HR, shift rosters, attendance, overtime, RBAC permissions, and governance.
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

export interface SubscriberRecord {
  id: string;
  customerCode: string;
  fullName: string;
  cnic: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  geoCoords: string;
  branchId: string;
  branchName: string;
  packageId: string;
  packageName: string;
  monthlyFeePkr: number;
  pppoeUsername: string;
  staticIp?: string;
  onuSerial: string;
  macAddress: string;
  oltHostname: string;
  oltSlotPort: string;
  fatBoxNumber: string;
  opticalRxDbm: number;
  opticalStatus: "optimal" | "warning" | "critical";
  currentSpeedDownMbps: number;
  currentSpeedUpMbps: number;
  ledgerBalancePkr: number;
  securityDepositPkr: number;
  status: "active" | "suspended_unpaid" | "frozen" | "terminated";
  installedAt: string;
  billingDueDay: number;
}

export interface TariffPackage {
  id: string;
  name: string;
  speedDownMbps: number;
  speedUpMbps: number;
  contentionRatio: string;
  pricePkrMonthly: number;
  ipPool: string;
  activeSubscribers: number;
  isPopular?: boolean;
}

export interface NewConnectionLead {
  id: string;
  leadNo: string;
  applicantName: string;
  phone: string;
  cnic: string;
  address: string;
  branchName: string;
  selectedPackage: string;
  stage: "inquiry" | "feasibility_passed" | "deposit_paid" | "installation_scheduled" | "activated";
  fatBoxNearest: string;
  fatDistanceMeters: number;
  portAvailable: boolean;
  securityDepositPkr: number;
  assignedVan?: string;
  createdAt: string;
}

export interface DepartmentRecord {
  id: string;
  name: string;
  code: string;
  leadName: string;
  headcount: number;
  activeTickets: number;
  slaTargetHours: number;
  color: string;
}

export interface StaffUserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  branchId: string;
  branchName: string;
  roleId: string;
  roleName: string;
  status: "online" | "field" | "shift" | "off_duty" | "on_leave";
  assignedVan?: string;
  tasksCompletedToday: number;
  csatRating: number;
  joinedDate: string;
}

export interface ShiftRoster {
  id: string;
  shiftName: string;
  timeRange: string;
  department: string;
  assignedStaff: string[];
  onCallStandby: string[];
  branchName: string;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  checkInMethod: "biometric" | "geofenced_mobile";
  isLate: boolean;
  overtimeHours: number;
  overtimeRateMultiplier: number;
  status: "present" | "half_day" | "on_leave" | "absent";
}

export interface WorkOrderTask {
  id: string;
  taskNo: string;
  title: string;
  type: "Fiber Drop Installation" | "OTDR Splicing Repair" | "Router Replacement" | "Doorstep Cash Recovery";
  subscriberCode: string;
  subscriberName: string;
  address: string;
  priority: "Critical" | "High" | "Normal";
  assignedTo: string;
  vanNo: string;
  status: "todo" | "assigned" | "en_route" | "in_progress" | "completed";
  dueAt: string;
}

export interface RbacRole {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  activeUsersCount: number;
  scope: "company_wide" | "branch_only";
  permissions: string[];
}

export interface CannedTemplate {
  id: string;
  shortcut: string;
  label: string;
  category: "NOC Diagnostic" | "Billing" | "Field Dispatch" | "General";
  templateText: string;
}

export interface SlaRule {
  id: string;
  priority: "Critical" | "High" | "Normal" | "Low";
  targetFirstResponseMins: number;
  targetResolutionHours: number;
  autoEscalateAfterMins: number;
  escalateToRole: string;
  notifyChannels: string[];
}

// 1. MOCK TENANT COMPANY
export const MOCK_TENANT_COMPANY: TenantCompany = {
  id: "comp-prime-01",
  name: "Prime Networks (Pvt) Ltd",
  slug: "prime-networks",
  subdomain: "primenetworks",
  status: "active",
  totalBranches: 20,
  totalSubscribers: 3420,
  features: {
    smartOlt: true,
    mikrotikRadius: true,
    zlUltraSync: true,
    omniChat: true,
    aiDiagnostics: true,
  },
  themeTokens: {
    primaryHex: "#2563EB",
    secondaryHex: "#1E293B",
  },
};

// 2. MOCK 20 BRANCH OFFICES
export const MOCK_BRANCHES: BranchOffice[] = [
  {
    id: "br-isb-01",
    companyId: "comp-prime-01",
    code: "ISB-F10",
    name: "Islamabad Core (F-10 HQ)",
    city: "Islamabad",
    address: "Plot 42, Sector F-10 Markaz, Islamabad",
    managerName: "Eng. Moiz Ahmad",
    managerPhone: "+92 300 8594021",
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
];

// 3. MOCK TARIFF PACKAGES
export const MOCK_PACKAGES: TariffPackage[] = [
  {
    id: "pkg-20m",
    name: "20 Mbps Home Starter",
    speedDownMbps: 20,
    speedUpMbps: 20,
    contentionRatio: "1:4 Shared",
    pricePkrMonthly: 2450,
    ipPool: "pool_residential_dhcp",
    activeSubscribers: 980,
  },
  {
    id: "pkg-50m",
    name: "50 Mbps Ultra Fiber",
    speedDownMbps: 50,
    speedUpMbps: 50,
    contentionRatio: "1:4 Shared",
    pricePkrMonthly: 3850,
    ipPool: "pool_residential_dhcp",
    activeSubscribers: 1840,
    isPopular: true,
  },
  {
    id: "pkg-100m",
    name: "100 Mbps Pro Gamer / Streamer",
    speedDownMbps: 100,
    speedUpMbps: 100,
    contentionRatio: "1:2 Low Latency",
    pricePkrMonthly: 5950,
    ipPool: "pool_fast_gaming",
    activeSubscribers: 480,
  },
  {
    id: "pkg-1g",
    name: "1 Gbps Corporate Dedicated",
    speedDownMbps: 1000,
    speedUpMbps: 1000,
    contentionRatio: "1:1 Dedicated CIR",
    pricePkrMonthly: 24000,
    ipPool: "pool_corporate_static",
    activeSubscribers: 120,
  },
];

// 4. MOCK SUBSCRIBERS DIRECTORY (3,420 count representation)
export const MOCK_SUBSCRIBERS: SubscriberRecord[] = [
  {
    id: "cus-84920",
    customerCode: "PK-84920",
    fullName: "Ali Hassan",
    cnic: "37405-8492019-1",
    phone: "+92 300 8594021",
    whatsapp: "+92 300 8594021",
    email: "ali.hassan@gmail.com",
    address: "House 24, Street 12, Sector F-10/2, Islamabad",
    geoCoords: "33.6938° N, 73.0135° E",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    packageId: "pkg-50m",
    packageName: "50 Mbps Ultra Fiber",
    monthlyFeePkr: 3850,
    pppoeUsername: "ali_f10",
    onuSerial: "HWTC-98B2-F104",
    macAddress: "48:57:02:9B:2F:10",
    oltHostname: "Huawei MA5800-X7 (ISB-F10-OLT-01)",
    oltSlotPort: "Slot 0/2 · PON-04",
    fatBoxNumber: "FAT-F10-12 (Port 3)",
    opticalRxDbm: -19.24,
    opticalStatus: "optimal",
    currentSpeedDownMbps: 48.6,
    currentSpeedUpMbps: 47.9,
    ledgerBalancePkr: 0,
    securityDepositPkr: 5000,
    status: "active",
    installedAt: "2025-06-14",
    billingDueDay: 1,
  },
  {
    id: "cus-88310",
    customerCode: "PK-88310",
    fullName: "Zainab Bibi",
    cnic: "35201-9876543-2",
    phone: "+92 321 9876543",
    whatsapp: "+92 321 9876543",
    email: "zainab.bibi@yahoo.com",
    address: "Plaza 4, Main Blvd, Gulberg III, Lahore",
    geoCoords: "31.5204° N, 74.3587° E",
    branchId: "br-lhr-01",
    branchName: "Lahore Gulberg III",
    packageId: "pkg-50m",
    packageName: "50 Mbps Ultra Fiber",
    monthlyFeePkr: 3850,
    pppoeUsername: "zainab_lhr_50m",
    onuSerial: "ZTED-1140-92B1",
    macAddress: "70:A8:E3:11:40:92",
    oltHostname: "ZTE C320 (LHR-GLB-OLT-02)",
    oltSlotPort: "Slot 0/1 · PON-02",
    fatBoxNumber: "FAT-GLB-08 (Port 5)",
    opticalRxDbm: -18.2,
    opticalStatus: "optimal",
    currentSpeedDownMbps: 49.1,
    currentSpeedUpMbps: 48.4,
    ledgerBalancePkr: 3850,
    securityDepositPkr: 5000,
    status: "suspended_unpaid",
    installedAt: "2025-08-20",
    billingDueDay: 1,
  },
  {
    id: "cus-99482",
    customerCode: "PK-99482",
    fullName: "Ahmed Malik",
    cnic: "37405-1234567-3",
    phone: "+92 300 1234567",
    whatsapp: "+92 300 1234567",
    email: "ahmed.malik@isb.pk",
    address: "House 112, Street 35, Blue Area, Islamabad",
    geoCoords: "33.7120° N, 73.0650° E",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    packageId: "pkg-100m",
    packageName: "100 Mbps Pro Gamer",
    monthlyFeePkr: 5950,
    pppoeUsername: "ahmed_malik_isb",
    onuSerial: "HWTC-8842-91A1",
    macAddress: "48:57:02:88:42:91",
    oltHostname: "Huawei MA5800-X7 (ISB-F10-OLT-01)",
    oltSlotPort: "Slot 0/2 · PON-04",
    fatBoxNumber: "FAT-ISB-04 (Port 1)",
    opticalRxDbm: -27.4,
    opticalStatus: "critical",
    currentSpeedDownMbps: 0.0,
    currentSpeedUpMbps: 0.0,
    ledgerBalancePkr: 0,
    securityDepositPkr: 6000,
    status: "active",
    installedAt: "2024-11-10",
    billingDueDay: 5,
  },
  {
    id: "cus-77120",
    customerCode: "PK-77120",
    fullName: "Kamran Akmal",
    cnic: "42101-4567890-5",
    phone: "+92 333 4567890",
    whatsapp: "+92 333 4567890",
    email: "kamran.akmal@gmail.com",
    address: "Block 5, Clifton, Karachi",
    geoCoords: "24.8138° N, 67.0299° E",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    packageId: "pkg-1g",
    packageName: "1 Gbps Corporate Dedicated",
    monthlyFeePkr: 24000,
    pppoeUsername: "kamran_corp_1g",
    onuSerial: "FHTT-3391-00C4",
    macAddress: "00:0A:EB:33:91:00",
    oltHostname: "Huawei MA5800-X7 (ISB-F10-OLT-01)",
    oltSlotPort: "Slot 0/4 · PON-12",
    fatBoxNumber: "FAT-CLF-01 (Port 2)",
    opticalRxDbm: -17.2,
    opticalStatus: "optimal",
    currentSpeedDownMbps: 980.4,
    currentSpeedUpMbps: 978.1,
    ledgerBalancePkr: 0,
    securityDepositPkr: 25000,
    status: "active",
    installedAt: "2024-02-18",
    billingDueDay: 1,
  },
];

// 5. MOCK NEW CONNECTIONS PIPELINE LEADS
export const MOCK_NEW_CONNECTIONS: NewConnectionLead[] = [
  {
    id: "lead-01",
    leadNo: "LD-9921",
    applicantName: "Dr. Bilal Qureshi",
    phone: "+92 300 4455667",
    cnic: "37405-9921445-7",
    address: "House 58, Street 4, Sector F-10/3, Islamabad",
    branchName: "Islamabad Core (F-10 HQ)",
    selectedPackage: "50 Mbps Ultra Fiber",
    stage: "installation_scheduled",
    fatBoxNearest: "FAT-F10-18 (Port 2 Available)",
    fatDistanceMeters: 65,
    portAvailable: true,
    securityDepositPkr: 5000,
    assignedVan: "Van #04 (Usman Ali)",
    createdAt: "2026-08-25",
  },
  {
    id: "lead-02",
    leadNo: "LD-9922",
    applicantName: "Hina Tariq",
    phone: "+92 333 1122334",
    cnic: "37405-1122334-8",
    address: "Apartment 302, Silver Heights, F-10 Markaz",
    branchName: "Islamabad Core (F-10 HQ)",
    selectedPackage: "100 Mbps Pro Gamer",
    stage: "feasibility_passed",
    fatBoxNearest: "FAT-F10-09 (Port 4 Available)",
    fatDistanceMeters: 40,
    portAvailable: true,
    securityDepositPkr: 6000,
    createdAt: "2026-08-26",
  },
  {
    id: "lead-03",
    leadNo: "LD-9923",
    applicantName: "Apex Logistics Office",
    phone: "+92 321 8877665",
    cnic: "37405-8877665-9",
    address: "Plaza 12, G-11 Markaz, Islamabad",
    branchName: "Islamabad Core (F-10 HQ)",
    selectedPackage: "1 Gbps Corporate Dedicated",
    stage: "inquiry",
    fatBoxNearest: "FAT-G11-04 (Port 1 Available)",
    fatDistanceMeters: 110,
    portAvailable: true,
    securityDepositPkr: 25000,
    createdAt: "2026-08-27",
  },
];

// 6. MOCK DEPARTMENTS
export const MOCK_DEPARTMENTS: DepartmentRecord[] = [
  {
    id: "dept-helpdesk",
    name: "Helpdesk & Customer Support (L1/L2)",
    code: "HD-L1",
    leadName: "Fatima Noor",
    headcount: 12,
    activeTickets: 8,
    slaTargetHours: 2,
    color: "#2563EB",
  },
  {
    id: "dept-noc",
    name: "NOC Core Engineering & OLT Fleet",
    code: "NOC-ENG",
    leadName: "Zubair Ahmed",
    headcount: 8,
    activeTickets: 4,
    slaTargetHours: 1,
    color: "#0284C7",
  },
  {
    id: "dept-field",
    name: "Field Operations & Splicing Vans",
    code: "FIELD-OPS",
    leadName: "Usman Ali",
    headcount: 18,
    activeTickets: 6,
    slaTargetHours: 4,
    color: "#D97706",
  },
  {
    id: "dept-billing",
    name: "Accounts, Recovery & Billing",
    code: "FIN-REC",
    leadName: "Bilal Hassan",
    headcount: 6,
    activeTickets: 2,
    slaTargetHours: 6,
    color: "#059669",
  },
  {
    id: "dept-sales",
    name: "Sales & New Connections",
    code: "SALES-CORP",
    leadName: "Adeel Malik",
    headcount: 4,
    activeTickets: 3,
    slaTargetHours: 24,
    color: "#8B5CF6",
  },
  {
    id: "dept-warehouse",
    name: "Warehouse & Hardware Store",
    code: "STORE-INV",
    leadName: "Rashid Minhas",
    headcount: 2,
    activeTickets: 0,
    slaTargetHours: 12,
    color: "#64748B",
  },
  {
    id: "dept-mgmt",
    name: "Executive Leadership & Audit",
    code: "EXEC-HQ",
    leadName: "Eng. Moiz Ahmad (CEO)",
    headcount: 2,
    activeTickets: 0,
    slaTargetHours: 0,
    color: "#1E293B",
  },
];

// 7. MOCK STAFF DIRECTORY (52 Total Staff Representation)
export const MOCK_STAFF_DIRECTORY: StaffUserRecord[] = [
  {
    id: "usr-01",
    name: "Eng. Moiz Ahmad",
    email: "moiz.ahmad@primenetworks.pk",
    phone: "+92 300 8594021",
    department: "Executive Leadership & Audit",
    designation: "Chief Executive Officer (CEO)",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    roleId: "role-owner",
    roleName: "Company Owner / Super-Admin",
    status: "online",
    tasksCompletedToday: 14,
    csatRating: 5.0,
    joinedDate: "2023-01-01",
  },
  {
    id: "usr-02",
    name: "Fatima Noor",
    email: "fatima.noor@primenetworks.pk",
    phone: "+92 301 5551234",
    department: "Helpdesk & Customer Support (L1/L2)",
    designation: "Helpdesk Lead Supervisor",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    roleId: "role-helpdesk",
    roleName: "Helpdesk Agent (L1/L2)",
    status: "online",
    tasksCompletedToday: 28,
    csatRating: 4.9,
    joinedDate: "2023-06-15",
  },
  {
    id: "usr-03",
    name: "Zubair Ahmed",
    email: "zubair.noc@primenetworks.pk",
    phone: "+92 333 5553303",
    department: "NOC Core Engineering & OLT Fleet",
    designation: "Principal NOC Engineer",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    roleId: "role-noc",
    roleName: "NOC Lead Engineer",
    status: "shift",
    tasksCompletedToday: 9,
    csatRating: 4.8,
    joinedDate: "2023-03-10",
  },
  {
    id: "usr-04",
    name: "Usman Ali",
    email: "usman.splicer@primenetworks.pk",
    phone: "+92 345 5557890",
    department: "Field Operations & Splicing Vans",
    designation: "Senior Fiber Splicer & OTDR Tech",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    roleId: "role-field",
    roleName: "Field Technician / Splicer",
    status: "field",
    assignedVan: "Van #04 (OTDR Splice Unit)",
    tasksCompletedToday: 5,
    csatRating: 4.9,
    joinedDate: "2023-08-01",
  },
  {
    id: "usr-05",
    name: "Bilal Hassan",
    email: "bilal.billing@primenetworks.pk",
    phone: "+92 302 5558877",
    department: "Accounts, Recovery & Billing",
    designation: "Billing & Recovery Manager",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    roleId: "role-billing",
    roleName: "Billing & Recovery Officer",
    status: "online",
    tasksCompletedToday: 18,
    csatRating: 4.7,
    joinedDate: "2023-05-20",
  },
  {
    id: "usr-06",
    name: "Rashid Minhas",
    email: "rashid.store@primenetworks.pk",
    phone: "+92 312 5559900",
    department: "Warehouse & Hardware Store",
    designation: "Warehouse Inventory Incharge",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    roleId: "role-warehouse",
    roleName: "Warehouse Incharge",
    status: "online",
    tasksCompletedToday: 12,
    csatRating: 4.9,
    joinedDate: "2024-01-15",
  },
];

// 8. MOCK SHIFT ROSTERS (24/7/365 Scheduling)
export const MOCK_SHIFTS: ShiftRoster[] = [
  {
    id: "shift-01",
    shiftName: "Morning Operations Shift",
    timeRange: "08:00 AM – 04:00 PM",
    department: "Helpdesk & Customer Support",
    assignedStaff: ["Fatima Noor", "Kiran Shah", "Hamza Tariq", "Ali Raza"],
    onCallStandby: ["Usman Ali (Van #04)"],
    branchName: "Islamabad Core (F-10 HQ)",
  },
  {
    id: "shift-02",
    shiftName: "Evening Peak Hours Shift",
    timeRange: "04:00 PM – 12:00 AM (Midnight)",
    department: "Helpdesk & NOC",
    assignedStaff: ["Zubair Ahmed", "Saad Qureshi", "Areeba Khan"],
    onCallStandby: ["Imran Splicer (Van #02)"],
    branchName: "Islamabad Core (F-10 HQ)",
  },
  {
    id: "shift-03",
    shiftName: "Night 24/7 NOC Roster",
    timeRange: "12:00 AM – 08:00 AM",
    department: "NOC Core Engineering",
    assignedStaff: ["Danyal Farooq (Night Lead)", "Waqas Mehmood"],
    onCallStandby: ["Emergency Night Splicing Crew #1"],
    branchName: "Islamabad Core (F-10 HQ)",
  },
];

// 9. MOCK ATTENDANCE & OVERTIME RECORDS
export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "att-01",
    staffId: "usr-01",
    staffName: "Eng. Moiz Ahmad",
    department: "Executive Leadership",
    date: "2026-08-27",
    clockIn: "08:45 AM",
    checkInMethod: "biometric",
    isLate: false,
    overtimeHours: 0,
    overtimeRateMultiplier: 1.0,
    status: "present",
  },
  {
    id: "att-02",
    staffId: "usr-04",
    staffName: "Usman Ali (Van #04)",
    department: "Field Operations",
    date: "2026-08-27",
    clockIn: "07:55 AM",
    checkInMethod: "geofenced_mobile",
    isLate: false,
    overtimeHours: 3.5,
    overtimeRateMultiplier: 1.5,
    status: "present",
  },
  {
    id: "att-03",
    staffId: "usr-02",
    staffName: "Fatima Noor",
    department: "Helpdesk",
    date: "2026-08-27",
    clockIn: "08:12 AM",
    checkInMethod: "biometric",
    isLate: true,
    overtimeHours: 1.0,
    overtimeRateMultiplier: 1.5,
    status: "present",
  },
];

// 10. MOCK TASK ALLOCATION BOARD
export const MOCK_WORK_ORDERS: WorkOrderTask[] = [
  {
    id: "wo-01",
    taskNo: "WO-8842",
    title: "Emergency Fiber Splicing on Splitter #4",
    type: "OTDR Splicing Repair",
    subscriberCode: "PK-99482",
    subscriberName: "Ahmed Malik",
    address: "House 112, Street 35, Blue Area, Islamabad",
    priority: "Critical",
    assignedTo: "Usman Ali",
    vanNo: "Van #04",
    status: "in_progress",
    dueAt: "Today, 02:00 PM",
  },
  {
    id: "wo-02",
    taskNo: "WO-9921",
    title: "New 50M Drop Installation & ONU Config",
    type: "Fiber Drop Installation",
    subscriberCode: "PK-9921",
    subscriberName: "Dr. Bilal Qureshi",
    address: "House 58, Street 4, Sector F-10/3",
    priority: "High",
    assignedTo: "Imran Splicer",
    vanNo: "Van #02",
    status: "assigned",
    dueAt: "Today, 04:30 PM",
  },
  {
    id: "wo-03",
    taskNo: "WO-7712",
    title: "Doorstep Bill Recovery (PKR 3,850)",
    type: "Doorstep Cash Recovery",
    subscriberCode: "PK-88310",
    subscriberName: "Zainab Bibi",
    address: "Plaza 4, Main Blvd, Gulberg III",
    priority: "Normal",
    assignedTo: "Bilal Hassan",
    vanNo: "Bike #03",
    status: "todo",
    dueAt: "Today, 06:00 PM",
  },
];

// 11. MOCK RBAC ROLES (35+ Actions)
export const MOCK_RBAC_ROLES: RbacRole[] = [
  {
    id: "role-owner",
    name: "Company Owner / Super-Admin",
    description: "Full unrestricted root access to all branches, billing, network telemetry, and audit trails.",
    isSystem: true,
    activeUsersCount: 2,
    scope: "company_wide",
    permissions: ["*"],
  },
  {
    id: "role-branch-mgr",
    name: "Branch Manager",
    description: "Full management and supervisory privileges restricted to the assigned regional branch.",
    isSystem: true,
    activeUsersCount: 20,
    scope: "branch_only",
    permissions: [
      "chat.view",
      "chat.reply",
      "chat.transfer",
      "tickets.view",
      "tickets.create",
      "tickets.assign",
      "tickets.resolve",
      "customers.view",
      "customers.create",
      "customers.edit",
      "billing.view_invoices",
      "billing.collect_cash",
      "staff.view",
      "shifts.assign",
      "attendance.view",
      "reports.view",
    ],
  },
  {
    id: "role-noc",
    name: "NOC Lead Engineer",
    description: "Optical diagnostic control, SmartOLT telemetry, PPPoE kick/reset, and regional outage alerts.",
    isSystem: true,
    activeUsersCount: 8,
    scope: "company_wide",
    permissions: [
      "noc.view_telemetry",
      "noc.reboot_onu",
      "noc.reset_pppoe",
      "noc.broadcast_outage",
      "tickets.view",
      "tickets.create",
      "tickets.resolve",
      "chat.view",
      "chat.internal_notes",
      "customers.view_technical",
    ],
  },
  {
    id: "role-helpdesk",
    name: "Helpdesk Agent (L1/L2)",
    description: "Omnichannel customer chat handling, trouble ticket escalation, and canned responses.",
    isSystem: true,
    activeUsersCount: 12,
    scope: "branch_only",
    permissions: [
      "chat.view",
      "chat.reply",
      "chat.transfer",
      "chat.close",
      "chat.internal_notes",
      "tickets.view",
      "tickets.create",
      "customers.view",
      "canned.use",
    ],
  },
  {
    id: "role-field",
    name: "Field Technician / Splicer",
    description: "Mobile work orders, OTDR test logging, on-site splicing photos, and van inventory.",
    isSystem: true,
    activeUsersCount: 40,
    scope: "branch_only",
    permissions: [
      "tasks.view_assigned",
      "tasks.update_status",
      "tasks.upload_proof",
      "attendance.mobile_checkin",
      "inventory.view_van_stock",
    ],
  },
  {
    id: "role-billing",
    name: "Billing & Recovery Officer",
    description: "Invoicing generation, counter cash collection, doorstep recovery wallet, and ledger receipts.",
    isSystem: true,
    activeUsersCount: 6,
    scope: "branch_only",
    permissions: [
      "billing.view_invoices",
      "billing.generate_invoices",
      "billing.collect_cash",
      "billing.doorstep_recovery",
      "customers.view",
      "reports.view_financial",
    ],
  },
  {
    id: "role-warehouse",
    name: "Warehouse Incharge",
    description: "Hardware serial barcode scanning, drop cable issuance, and faulty RMA tracking.",
    isSystem: true,
    activeUsersCount: 2,
    scope: "company_wide",
    permissions: [
      "inventory.view",
      "inventory.manage_serials",
      "inventory.issue_to_tech",
      "inventory.receive_returns",
    ],
  },
  {
    id: "role-auditor",
    name: "Auditor / Read-Only",
    description: "Read-only access to immutable compliance logs, security streams, and financial ledgers.",
    isSystem: true,
    activeUsersCount: 1,
    scope: "company_wide",
    permissions: [
      "audit.view_logs",
      "audit.export_compliance",
      "reports.view_all",
      "customers.view_readonly",
    ],
  },
];

// 12. MOCK CANNED SLASH SHORTCUTS
export const MOCK_CANNED_SHORTCUTS: CannedTemplate[] = [
  {
    id: "can-01",
    shortcut: "/signal",
    label: "SmartOLT Signal Status",
    category: "NOC Diagnostic",
    templateText: "SmartOLT diagnostic check: Your optical RX power level is currently nominal at {{optical_signal}} dBm on Slot 0/2, PON-04.",
  },
  {
    id: "can-02",
    shortcut: "/dispatch",
    label: "Field Splicer Dispatched",
    category: "Field Dispatch",
    templateText: "Field Engineer {{technician_name}} (Van #04) has been dispatched with an OTDR splicing meter to inspect your fiber drop link.",
  },
  {
    id: "can-03",
    shortcut: "/reboot",
    label: "TR-069 Router Power Cycle",
    category: "NOC Diagnostic",
    templateText: "Please power off the router adapter for 30 seconds and turn it back on to trigger a clean PPPoE re-authentication.",
  },
  {
    id: "can-04",
    shortcut: "/bill",
    label: "Payment Verified & Cleared",
    category: "Billing",
    templateText: "Your payment of PKR {{invoice_amount}} has been verified and synced to your ZL Ultra ledger. Thank you!",
  },
  {
    id: "can-05",
    shortcut: "/promo",
    label: "Upgrade to 100M Ultra Promo",
    category: "General",
    templateText: "Exclusive offer for {{customer_name}}: Upgrade to 100 Mbps Pro Gamer package today with zero migration fee & free Static IP!",
  },
];

// 13. MOCK SLA RULES
export const MOCK_SLA_RULES: SlaRule[] = [
  {
    id: "sla-crit",
    priority: "Critical",
    targetFirstResponseMins: 5,
    targetResolutionHours: 1,
    autoEscalateAfterMins: 15,
    escalateToRole: "NOC Lead Engineer",
    notifyChannels: ["SMS", "WhatsApp Alert", "Dashboard Audio Alarm"],
  },
  {
    id: "sla-high",
    priority: "High",
    targetFirstResponseMins: 15,
    targetResolutionHours: 4,
    autoEscalateAfterMins: 30,
    escalateToRole: "Branch Manager",
    notifyChannels: ["Dashboard Notification", "Email"],
  },
  {
    id: "sla-norm",
    priority: "Normal",
    targetFirstResponseMins: 30,
    targetResolutionHours: 12,
    autoEscalateAfterMins: 60,
    escalateToRole: "Helpdesk Supervisor",
    notifyChannels: ["Dashboard Notification"],
  },
];

// 14. MOCK COMPANY PROFILE & TAX SETTINGS
export const MOCK_COMPANY_PROFILE = {
  legalName: "Prime Networks Pakistan (Pvt) Ltd",
  brandName: "Prime One Telecom",
  ntnNumber: "7849201-9",
  strnNumber: "32-00-7849-201-19",
  ptaLicenseNumber: "PTA-ISP-DIR-ISB-2024-8842",
  helplinePhone: "051-111-PRIME (77463)",
  whatsappSupport: "+92 300 8594021",
  supportEmail: "support@primenetworks.pk",
  headOfficeAddress: "Plot 42, Sector F-10 Markaz, Islamabad, Pakistan",
  invoiceFooterTerms: "Payment due on 1st of every calendar month. Late fee of PKR 250 applies after 10th. All services regulated under PTA consumer guidelines.",
  bankDetails: {
    bankName: "Meezan Bank Ltd",
    accountTitle: "Prime Networks Pakistan Pvt Ltd",
    accountNumber: "02010108492019",
    iban: "PK88MEZN0002010108492019",
  },
  apiIntegrations: {
    smartOltUrl: "https://primenetworks.smartolt.com/api/v1",
    smartOltStatus: "Connected (Latency: 12ms)",
    mikrotikRadiusIp: "10.240.10.1:1812",
    mikrotikStatus: "Online (14,280 Sessions)",
    whatsAppCloudApi: "Connected (+92 300 8594021)",
    oneLinkGateway: "Active (Instant Clearance)",
  },
};

// 15. LEGACY USER PROFILES
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
    name: "Eng. Moiz Ahmad (CEO)",
    email: "ceo@primenetworks.pk",
    role: "company_owner",
    department: "Executive",
    companyId: "comp-prime-01",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    permissions: ["*"],
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
    permissions: ["branch.*", "chat.*", "tickets.*", "customers.*"],
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
    branchName: "Islamabad Core (F-10 HQ)",
    permissions: ["noc.*", "olt.*", "radius.*", "tickets.*"],
    isOnline: true,
  },
  helpdesk_agent: {
    id: "usr-csr-01",
    name: "Fatima Noor (Helpdesk Lead)",
    email: "fatima.noor@primenetworks.pk",
    role: "helpdesk_agent",
    department: "Helpdesk",
    companyId: "comp-prime-01",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    permissions: ["chat.*", "tickets.*", "customers.view"],
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
    branchName: "Islamabad Core (F-10 HQ)",
    permissions: ["tasks.*", "tickets.update"],
    isOnline: true,
  },
  accounts_officer: {
    id: "usr-acc-01",
    name: "Bilal Hassan (Billing Lead)",
    email: "billing@primenetworks.pk",
    role: "accounts_officer",
    department: "Accounts",
    companyId: "comp-prime-01",
    permissions: ["billing.*", "invoices.*"],
    isOnline: true,
  },
  customer: {
    id: "cus-84920",
    name: "Ali Hassan",
    email: "ali.hassan@gmail.com",
    role: "customer",
    companyId: "comp-prime-01",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    permissions: ["customer.*"],
    isOnline: true,
  },
};

// 16. MOCK CONVERSATIONS & CHAT STREAMS
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-01",
    companyId: "comp-prime-01",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    customerId: "cus-84920",
    customerName: "Ali Hassan",
    customerPhone: "+92 300 8594021",
    customerAccountNo: "PK-84920",
    pppoeUsername: "ali_f10",
    status: "active",
    assignedAgentId: "usr-csr-01",
    assignedAgentName: "Fatima Noor",
    lastMessage: "Salam, my router LOS light started blinking red 10 minutes ago.",
    lastMessageAt: new Date().toISOString(),
    unreadCount: 0,
    channel: "whatsapp",
    slaExpiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
    isSlaBreached: false,
    opticalRxDbm: -19.24,
  },
];

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  "conv-01": [
    {
      id: "msg-01",
      conversationId: "conv-01",
      senderId: "cus-84920",
      senderName: "Ali Hassan",
      senderRole: "customer",
      content: "Salam, my router LOS light started blinking red 10 minutes ago.",
      type: "text",
      status: "read",
      createdAt: new Date().toISOString(),
    },
  ],
};

// 17. MOCK TICKETS
export const MOCK_TICKETS: TroubleTicket[] = [
  {
    id: "tkt-01",
    ticketNo: "TK-8842",
    customerId: "cus-84920",
    customerName: "Ali Hassan",
    customerPhone: "+92 300 8594021",
    pppoeUsername: "ali_f10",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    category: "High Optical Attenuation",
    priority: "High",
    status: "In Progress",
    assignedDepartments: ["Field Operations", "NOC"],
    assignedEngineers: ["Usman Ali (Van #04)"],
    ettrHours: 2,
    slaExpiresAt: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    isSlaBreached: false,
    opticalRxDbm: -19.24,
    description: "Optical drop detected on Splitter #4.",
    createdAt: new Date().toISOString(),
  },
];

// Central Mock Database Facade
export const mockDb = {
  tenantCompany: MOCK_TENANT_COMPANY,
  users: MOCK_USERS,
  conversations: MOCK_CONVERSATIONS,
  messages: MOCK_MESSAGES,
  tickets: MOCK_TICKETS,
  branches: MOCK_BRANCHES,
  packages: MOCK_PACKAGES,
  subscribers: MOCK_SUBSCRIBERS,
  newConnections: MOCK_NEW_CONNECTIONS,
  departments: MOCK_DEPARTMENTS,
  staff: MOCK_STAFF_DIRECTORY,
  shifts: MOCK_SHIFTS,
  attendance: MOCK_ATTENDANCE,
  workOrders: MOCK_WORK_ORDERS,
  roles: MOCK_RBAC_ROLES,
  cannedShortcuts: MOCK_CANNED_SHORTCUTS,
  slaRules: MOCK_SLA_RULES,
  companyProfile: MOCK_COMPANY_PROFILE,
};

