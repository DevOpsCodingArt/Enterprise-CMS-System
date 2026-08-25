export interface MockTenant {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  plan: 'Starter' | 'Growth' | 'Enterprise';
  status: 'Active' | 'Suspended' | 'Provisioning';
  databaseSchema: string;
  branchesCount: number;
  subscribersCount: number;
  mrr: number;
  primaryColor: string;
  secondaryColor: string;
  health: string;
  createdAt: string;
}

export const mockTenants: MockTenant[] = [
  {
    id: 'cmp_01',
    name: 'Prime Networks (Pvt) Ltd',
    slug: 'prime-networks',
    subdomain: 'prime.primeone.pk',
    ownerName: 'Moiz Ahmad',
    ownerEmail: 'ceo@primenetworks.pk',
    ownerPhone: '+92 300 1234567',
    plan: 'Enterprise',
    status: 'Active',
    databaseSchema: 'tenant_prime_networks',
    branchesCount: 20,
    subscribersCount: 18420,
    mrr: 125000,
    primaryColor: '#0047FF',
    secondaryColor: '#00E5FF',
    health: '99.99%',
    createdAt: '2026-01-01',
  },
  {
    id: 'cmp_02',
    name: 'FiberTech Broadband',
    slug: 'fibertech-pk',
    subdomain: 'fibertech.primeone.pk',
    ownerName: 'Rashid Mehmood',
    ownerEmail: 'rashid@fibertech.pk',
    ownerPhone: '+92 321 9876543',
    plan: 'Growth',
    status: 'Active',
    databaseSchema: 'tenant_fibertech',
    branchesCount: 8,
    subscribersCount: 8940,
    mrr: 75000,
    primaryColor: '#00FFAA',
    secondaryColor: '#FFBB00',
    health: '99.98%',
    createdAt: '2026-02-14',
  },
  {
    id: 'cmp_03',
    name: 'OptiNet Communications',
    slug: 'optinet-isb',
    subdomain: 'optinet.primeone.pk',
    ownerName: 'Zainab Tariq',
    ownerEmail: 'admin@optinet.pk',
    ownerPhone: '+92 333 5554433',
    plan: 'Enterprise',
    status: 'Active',
    databaseSchema: 'tenant_optinet',
    branchesCount: 14,
    subscribersCount: 12600,
    mrr: 125000,
    primaryColor: '#6366F1',
    secondaryColor: '#EC4899',
    health: '100.0%',
    createdAt: '2026-03-01',
  },
  {
    id: 'cmp_04',
    name: 'Nexus Fiber Telecom',
    slug: 'nexus-fiber',
    subdomain: 'nexus.primeone.pk',
    ownerName: 'Kamran Ali',
    ownerEmail: 'ops@nexusfiber.pk',
    ownerPhone: '+92 312 4443322',
    plan: 'Starter',
    status: 'Active',
    databaseSchema: 'tenant_nexus_fiber',
    branchesCount: 4,
    subscribersCount: 3240,
    mrr: 35000,
    primaryColor: '#F59E0B',
    secondaryColor: '#10B981',
    health: '99.95%',
    createdAt: '2026-05-10',
  },
  {
    id: 'cmp_05',
    name: 'SpeedLink Gigabit',
    slug: 'speedlink-khi',
    subdomain: 'speedlink.primeone.pk',
    ownerName: 'Fahad Siddiqui',
    ownerEmail: 'fahad@speedlink.pk',
    ownerPhone: '+92 301 7778899',
    plan: 'Growth',
    status: 'Active',
    databaseSchema: 'tenant_speedlink',
    branchesCount: 6,
    subscribersCount: 5000,
    mrr: 75000,
    primaryColor: '#3B82F6',
    secondaryColor: '#8B5CF6',
    health: '99.99%',
    createdAt: '2026-06-20',
  },
];
