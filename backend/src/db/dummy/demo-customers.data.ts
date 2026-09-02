export interface DemoCustomer {
  branchCode: string;
  customerCode: string;
  fullName: string;
  cnic: string;
  email: string;
  phone: string;
  username: string;
  address: string;
  area: string;
  city: string;
  latitude: string;
  longitude: string;
  customerClass: 'residential' | 'corporate';
  packageName: string;
  packageSpeed: string;
  monthlyBilling: string;
  pppoeStatus: 'online' | 'offline' | 'disabled';
  currentIp: string;
  macAddress: string;
  onuSignalDbm: string;
  oltPonPort: string;
  status: 'active' | 'suspended' | 'expired' | 'terminated';
}

export const DEMO_CUSTOMERS: DemoCustomer[] = [
  {
    branchCode: 'ISB-01',
    customerCode: 'CUS-1001',
    fullName: 'Muhammad Ali Khan',
    cnic: '61101-1234567-1',
    email: 'ali.khan@gmail.com',
    phone: '+92 300 1234567',
    username: 'ali.fiber50',
    address: 'House 45, Street 12, F-10/2, Islamabad',
    area: 'F-10/2',
    city: 'Islamabad',
    latitude: '33.6934',
    longitude: '73.0112',
    customerClass: 'residential',
    packageName: '50 Mbps Fiber Unlimited',
    packageSpeed: '50 Mbps',
    monthlyBilling: '3500.00',
    pppoeStatus: 'online',
    currentIp: '192.168.10.45',
    macAddress: 'BC:A9:93:4F:11:A2',
    onuSignalDbm: '-19.50',
    oltPonPort: 'EPON0/1:4',
    status: 'active',
  },
  {
    branchCode: 'ISB-01',
    customerCode: 'CUS-1002',
    fullName: 'Fatima Corporate Services Ltd',
    cnic: '37405-9876543-2',
    email: 'info@fatimacorp.pk',
    phone: '+92 333 9876543',
    username: 'fatima.corp100',
    address: 'Office 402, Evacuee Trust Complex, Blue Area, Islamabad',
    area: 'Blue Area',
    city: 'Islamabad',
    latitude: '33.7214',
    longitude: '73.0782',
    customerClass: 'corporate',
    packageName: '100 Mbps Dedicated Symmetrical Fiber',
    packageSpeed: '100 Mbps',
    monthlyBilling: '18500.00',
    pppoeStatus: 'online',
    currentIp: '192.168.10.82',
    macAddress: '48:8F:5A:21:6E:9C',
    onuSignalDbm: '-18.20',
    oltPonPort: 'GPON0/2:1',
    status: 'active',
  },
  {
    branchCode: 'RWP-01',
    customerCode: 'CUS-1003',
    fullName: 'Usman Tariq',
    cnic: '37405-1122334-9',
    email: 'usman.t@yahoo.com',
    phone: '+92 321 5566778',
    username: 'usman.home30',
    address: 'Flat 3, Al-Madina Arcade, Saddar, Rawalpindi',
    area: 'Saddar',
    city: 'Rawalpindi',
    latitude: '33.5992',
    longitude: '73.0545',
    customerClass: 'residential',
    packageName: '30 Mbps Fiber Starter',
    packageSpeed: '30 Mbps',
    monthlyBilling: '2500.00',
    pppoeStatus: 'offline',
    currentIp: '0.0.0.0',
    macAddress: 'E8:94:F6:12:34:56',
    onuSignalDbm: '-27.80',
    oltPonPort: 'EPON0/3:2',
    status: 'active',
  },
];
