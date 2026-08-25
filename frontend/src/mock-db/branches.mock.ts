export interface MockBranch {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  phone: string;
  supervisor: string;
  subscribers: string;
  subscribersCount: number;
  activeStaffCount: number;
  subnet: string;
  subnets: string;
  smartOltPonCount: number;
  vanFleet: string;
  vanFleetCount: number;
  activeQueues: number;
  latency: string;
  opticalHealth: string;
  status: 'Operational' | 'Degraded' | 'Maintenance';
}

export const mockBranches: MockBranch[] = [
  {
    id: 'br_isb_f10',
    name: 'Islamabad F-10 Main Hub',
    code: 'ISB-F10',
    city: 'Islamabad',
    address: 'Plot 14, Main Markaz, Sector F-10, Islamabad',
    phone: '+92 51 2211001',
    supervisor: 'Eng. Imran Khan',
    subscribers: '4,820',
    subscribersCount: 4820,
    activeStaffCount: 14,
    subnet: '192.168.10.0/24',
    subnets: '192.168.10.0/24 (GPON-F10)',
    smartOltPonCount: 16,
    vanFleet: '4 Online',
    vanFleetCount: 4,
    activeQueues: 3,
    latency: '0.3ms',
    opticalHealth: '99.98%',
    status: 'Operational',
  },
  {
    id: 'br_isb_g11',
    name: 'Islamabad G-11 Sub-Station',
    code: 'ISB-G11',
    city: 'Islamabad',
    address: 'Shop 4, Al-Rehman Plaza, G-11 Markaz, Islamabad',
    phone: '+92 51 2288002',
    supervisor: 'Eng. Bilal Ahmed',
    subscribers: '3,140',
    subscribersCount: 3140,
    activeStaffCount: 8,
    subnet: '192.168.11.0/24',
    subnets: '192.168.11.0/24 (GPON-G11)',
    smartOltPonCount: 8,
    vanFleet: '2 Online',
    vanFleetCount: 2,
    activeQueues: 1,
    latency: '0.4ms',
    opticalHealth: '100%',
    status: 'Operational',
  },
  {
    id: 'br_isb_blue',
    name: 'Blue Area Corporate Core',
    code: 'ISB-BLUE',
    city: 'Islamabad',
    address: 'Floor 2, State Life Building, Blue Area, Islamabad',
    phone: '+92 51 2822003',
    supervisor: 'Eng. Hamza Tariq',
    subscribers: '5,920',
    subscribersCount: 5920,
    activeStaffCount: 18,
    subnet: '192.168.20.0/24',
    subnets: '192.168.20.0/24 (CORP-BGP)',
    smartOltPonCount: 24,
    vanFleet: '6 Online',
    vanFleetCount: 6,
    activeQueues: 2,
    latency: '0.2ms',
    opticalHealth: '99.99%',
    status: 'Operational',
  },
  {
    id: 'br_rwp_sdr',
    name: 'Rawalpindi Saddar Regional Hub',
    code: 'RWP-SDR',
    city: 'Rawalpindi',
    address: 'Plaza 22, Bank Road, Saddar, Rawalpindi',
    phone: '+92 51 5566004',
    supervisor: 'Eng. Usman Ali',
    subscribers: '4,540',
    subscribersCount: 4540,
    activeStaffCount: 12,
    subnet: '192.168.30.0/24',
    subnets: '192.168.30.0/24 (GPON-SDR)',
    smartOltPonCount: 16,
    vanFleet: '5 Online',
    vanFleetCount: 5,
    activeQueues: 4,
    latency: '0.5ms',
    opticalHealth: '99.95%',
    status: 'Operational',
  },
];
