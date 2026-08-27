import type { UserProfile, UserRole } from "@/types/auth.types";

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
