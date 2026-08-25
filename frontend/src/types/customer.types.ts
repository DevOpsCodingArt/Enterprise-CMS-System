export type CustomerClass = 'residential' | 'business' | 'corporate' | 'government' | 'vip';
export type CustomerStatus = 'active' | 'inactive' | 'suspended' | 'disconnected';

export interface Customer {
  id: string;
  companyId: string;
  branchId?: string | null;
  customerCode: string;
  fullName: string;
  cnic?: string | null;
  email?: string | null;
  phone: string;
  altPhone?: string | null;
  username?: string | null; // PPPoE username
  address?: string | null;
  area?: string | null;
  city: string;
  latitude?: number | null;
  longitude?: number | null;
  customerClass: CustomerClass;
  packageId?: string | null;
  packageName: string;
  packageSpeed: string;
  monthlyBilling: number | string;
  billingExpiryDate?: string | null;
  pppoeStatus: string;
  currentIp?: string | null;
  macAddress?: string | null;
  onuSignalDbm?: number | string | null;
  oltPonPort?: string | null;
  status: CustomerStatus;
  registrationDate?: string | null;
  activationDate?: string | null;
  notes?: string | null;
  avatarUrl?: string | null;
  languagePreference: string;
  createdAt: string;
  updatedAt: string;
  branch?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export interface Customer360 {
  customer: Customer;
  opticalTelemetry: {
    rxDbm: number;
    txDbm?: number;
    status: 'nominal' | 'warning' | 'critical' | 'dead';
    oltName: string;
    ponPort: string;
    onuSerial: string;
    onuModel: string;
    lastPolledAt: string;
  };
  billing: {
    packageName: string;
    speed: string;
    monthlyDues: number;
    balanceDue: number;
    billingCycle: string;
    expiryDate: string;
    paymentStatus: 'paid' | 'overdue' | 'unpaid' | 'grace_period';
    lastPaymentDate?: string;
    lastPaymentAmount?: number;
  };
  networkSession: {
    pppoeUsername: string;
    ipAddress: string;
    macAddress: string;
    sessionUptime: string;
    downloadSpeed: string;
    uploadSpeed: string;
    nasIp: string;
  };
  recentTickets: Array<{
    id: string;
    ticketNumber: string;
    category: string;
    status: string;
    priority: string;
    createdAt: string;
    resolvedAt?: string;
  }>;
  recentConversations: Array<{
    id: string;
    subject?: string;
    status: string;
    lastMessageAt: string;
    closedAt?: string;
  }>;
}

export interface Branch {
  id: string;
  companyId: string;
  name: string;
  code: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isActive: boolean;
  activeSubscribers?: number;
  activeQueueCount?: number;
  meanLatency?: string;
  opticalHealth?: string;
  vanFleetOnline?: number;
  createdAt: string;
  updatedAt: string;
}
