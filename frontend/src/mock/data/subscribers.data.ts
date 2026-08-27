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
