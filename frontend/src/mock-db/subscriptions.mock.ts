export interface MockSaaSTier {
  id: string;
  name: string;
  code: 'Starter' | 'Growth' | 'Enterprise';
  pricePKR: number;
  billingInterval: 'monthly' | 'yearly';
  maxBranches: number;
  maxSubscribers: number;
  maxStaffSeats: number;
  features: {
    smartOltIntegration: boolean;
    mikrotikApiDiagnostics: boolean;
    supervisorLiveHud: boolean;
    customDomainBranding: boolean;
    dedicatedRedisCluster: boolean;
    priority24_7Sla: boolean;
  };
  activeTenantsCount: number;
}

export interface MockSaaSInvoice {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  amountPKR: number;
  tier: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  issueDate: string;
  dueDate: string;
  paidAt?: string | null;
}

export const mockSaaSTiers: MockSaaSTier[] = [
  {
    id: 'tier_starter',
    name: 'Starter Tier',
    code: 'Starter',
    pricePKR: 35000,
    billingInterval: 'monthly',
    maxBranches: 5,
    maxSubscribers: 5000,
    maxStaffSeats: 15,
    features: {
      smartOltIntegration: false,
      mikrotikApiDiagnostics: true,
      supervisorLiveHud: false,
      customDomainBranding: false,
      dedicatedRedisCluster: false,
      priority24_7Sla: false,
    },
    activeTenantsCount: 2,
  },
  {
    id: 'tier_growth',
    name: 'Growth Tier',
    code: 'Growth',
    pricePKR: 75000,
    billingInterval: 'monthly',
    maxBranches: 10,
    maxSubscribers: 15000,
    maxStaffSeats: 40,
    features: {
      smartOltIntegration: true,
      mikrotikApiDiagnostics: true,
      supervisorLiveHud: true,
      customDomainBranding: true,
      dedicatedRedisCluster: false,
      priority24_7Sla: false,
    },
    activeTenantsCount: 4,
  },
  {
    id: 'tier_enterprise',
    name: 'Enterprise Tier',
    code: 'Enterprise',
    pricePKR: 125000,
    billingInterval: 'monthly',
    maxBranches: 999,
    maxSubscribers: 100000,
    maxStaffSeats: 200,
    features: {
      smartOltIntegration: true,
      mikrotikApiDiagnostics: true,
      supervisorLiveHud: true,
      customDomainBranding: true,
      dedicatedRedisCluster: true,
      priority24_7Sla: true,
    },
    activeTenantsCount: 8,
  },
];

export const mockSaaSInvoices: MockSaaSInvoice[] = [
  {
    id: 'inv_01',
    invoiceNumber: 'INV-2026-08-01',
    tenantId: 'cmp_01',
    tenantName: 'Prime Networks (Pvt) Ltd',
    amountPKR: 125000,
    tier: 'Enterprise Tier',
    status: 'Paid',
    issueDate: '2026-08-01',
    dueDate: '2026-08-10',
    paidAt: '2026-08-03',
  },
  {
    id: 'inv_02',
    invoiceNumber: 'INV-2026-08-02',
    tenantId: 'cmp_02',
    tenantName: 'FiberTech Broadband',
    amountPKR: 75000,
    tier: 'Growth Tier',
    status: 'Paid',
    issueDate: '2026-08-01',
    dueDate: '2026-08-10',
    paidAt: '2026-08-05',
  },
  {
    id: 'inv_03',
    invoiceNumber: 'INV-2026-08-03',
    tenantId: 'cmp_03',
    tenantName: 'OptiNet Communications',
    amountPKR: 125000,
    tier: 'Enterprise Tier',
    status: 'Paid',
    issueDate: '2026-08-01',
    dueDate: '2026-08-10',
    paidAt: '2026-08-02',
  },
  {
    id: 'inv_04',
    invoiceNumber: 'INV-2026-08-04',
    tenantId: 'cmp_04',
    tenantName: 'Nexus Fiber Telecom',
    amountPKR: 35000,
    tier: 'Starter Tier',
    status: 'Pending',
    issueDate: '2026-08-01',
    dueDate: '2026-08-28',
    paidAt: null,
  },
];
