export interface TariffPackage {
  id: string;
  name: string;
  code?: string;
  speedDownMbps: number;
  speedUpMbps: number;
  contentionRatio: string;
  pricePkrMonthly: number | string;
  ipPool: string;
  activeSubscribers: number;
  isPopular?: boolean;
}

export interface SubscriberRecord {
  id: string;
  customerCode: string;
  fullName: string;
  cnic: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address: string;
  geoCoords?: string;
  branchId?: string;
  branchName: string;
  packageId?: string;
  packageName: string;
  monthlyFeePkr: number;
  monthlyBilling?: string | number;
  pppoeUsername: string;
  username?: string;
  staticIp?: string;
  onuSerial?: string;
  macAddress?: string;
  oltHostname?: string;
  oltSlotPort?: string;
  oltPonPort?: string;
  fatBoxNumber?: string;
  opticalRxDbm: number;
  onuSignalDbm?: string | number;
  opticalStatus?: "optimal" | "warning" | "critical";
  currentSpeedDownMbps?: number;
  currentSpeedUpMbps?: number;
  ledgerBalancePkr: number;
  securityDepositPkr?: number;
  status: "active" | "suspended" | "frozen" | "terminated" | "disconnected" | "inactive" | "suspended_unpaid";
  installedAt?: string;
  registrationDate?: string;
  billingDueDay?: number;
  billingExpiryDate?: string;
}

export interface TroubleTicket {
  id: string;
  ticketNo: string;
  ticketNumber?: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  pppoeUsername?: string;
  branchId?: string;
  branchName?: string;
  category: string;
  priority: string;
  status: string;
  assignedDepartments?: string[];
  assignedEngineers?: string[];
  assignedDepartment?: string;
  assignedTo?: string;
  ettrHours?: number;
  slaExpiresAt?: string;
  isSlaBreached?: boolean;
  opticalRxDbm?: number;
  description: string;
  title?: string;
  createdAt: string;
}

export interface WorkOrderTask {
  id: string;
  taskNo: string;
  title: string;
  type: string;
  subscriberCode?: string;
  subscriberName?: string;
  address?: string;
  priority: "Critical" | "High" | "Normal";
  assignedTo: string;
  vanNo: string;
  status: "todo" | "assigned" | "en_route" | "in_progress" | "completed";
  dueAt: string;
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

export interface NewConnectionLead {
  id: string;
  leadNo: string;
  applicantName: string;
  fatherName?: string;
  phone: string;
  cnic?: string;
  address: string;
  branchName?: string;
  selectedPackage: string;
  connectionType: string;
  deviceModel: string;
  macAddress?: string;
  fiberDistanceMeters: number;
  stage: "inquiry" | "feasibility_passed" | "deposit_paid" | "installation_scheduled" | "activated" | "cancelled" | "inactive";
  status: "Pending" | "Active" | "Inactive" | "Cancelled";
  fatBoxNearest?: string;
  portAvailable?: boolean;
  otcPkr: number | string;
  monthlyBillPkr: number | string;
  otcPaidPkr: number | string;
  monthlyBillPaidPkr: number | string;
  assignedVan?: string;
  assignedBy?: string;
  remarks?: string;
  opticalSignalDbm?: string;
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
  phone?: string;
  department: string;
  designation: string;
  branchId?: string;
  branchName?: string;
  roleId?: string;
  roleName?: string;
  status: "online" | "field" | "shift" | "off_duty" | "on_leave";
  assignedVan?: string;
  tasksCompletedToday?: number;
  csatRating?: number;
  joinedDate?: string;
  customPermissions?: string[];
}

export interface ShiftRoster {
  id: string;
  shiftName: string;
  timeRange: string;
  department: string;
  assignedStaff: string[];
  onCallStandby: string[];
  branchName?: string;
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
  overtimeHours: number | string;
  overtimeRateMultiplier: number | string;
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
  title?: string;
  label?: string;
  body?: string;
  templateText?: string;
  category: string;
  useCount?: number;
}
