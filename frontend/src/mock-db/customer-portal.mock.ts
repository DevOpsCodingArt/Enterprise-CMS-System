import { Customer } from '@/types/customer.types';

export interface CustomerInvoice {
  id: string;
  invoiceNumber: string;
  month: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'unpaid' | 'overdue' | 'pending_verification';
  paymentMethod?: string;
  paidAt?: string;
  transactionRef?: string;
  receiptUrl?: string;
}

export interface CustomerTicket {
  id: string;
  ticketNumber: string;
  category: 'fiber_break' | 'router_config' | 'billing' | 'speed_issue' | 'other';
  title: string;
  description: string;
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'urgent';
  createdAt: string;
  ettr?: string;
  assignedTechnician?: {
    name: string;
    vanCode: string;
    phone: string;
    distanceEta: string;
    currentStage: 'dispatched' | 'en_route' | 'on_site' | 'splicing' | 'verified';
  };
  resolutionNotes?: string;
  resolvedAt?: string;
}

export interface CustomerChatMessage {
  id: string;
  sender: 'customer' | 'agent' | 'system';
  senderName: string;
  text: string;
  fileUrl?: string;
  fileType?: 'image' | 'document' | 'audio';
  timestamp: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface PaymentGatewayChannel {
  id: string;
  name: string;
  accountNumber: string;
  title: string;
  type: 'mobile_wallet' | 'bank_transfer' | 'fintech';
}

export const mockCustomerPortalSubscriber: Customer = {
  id: 'cus_ali_f10_01',
  companyId: 'cmp_prime_networks_01',
  branchId: 'br_isb_f10',
  customerCode: 'CUS-ISB-1001',
  fullName: 'Muhammad Ali Hassan',
  cnic: '61101-1234567-1',
  email: 'ali.hassan@gmail.com',
  phone: '+92 300 1234567',
  altPhone: '+92 51 2800100',
  username: 'ali.fiber50',
  address: 'House 45, Street 12, Sector F-10/2',
  area: 'F-10/2',
  city: 'Islamabad',
  latitude: 33.6934,
  longitude: 73.0112,
  customerClass: 'residential',
  packageName: '50 Mbps Ultra Fiber Symmetrical',
  packageSpeed: '50 Mbps',
  monthlyBilling: 3500,
  billingExpiryDate: '2026-09-05',
  pppoeStatus: 'online',
  currentIp: '192.168.10.45',
  macAddress: 'BC:A9:93:4F:11:A2',
  onuSignalDbm: -19.5,
  oltPonPort: 'Huawei-OLT-F10 // PON-4:2',
  status: 'active',
  languagePreference: 'en',
  createdAt: '2026-01-15T09:00:00Z',
  updatedAt: '2026-08-25T12:00:00Z',
  branch: {
    id: 'br_isb_f10',
    name: 'Islamabad F-10 Main Hub',
    code: 'ISB-F10',
  },
};

export const mockCustomerInvoices: CustomerInvoice[] = [
  {
    id: 'inv_2026_08',
    invoiceNumber: 'INV-2026-0841',
    month: 'August 2026',
    issueDate: '2026-08-01',
    dueDate: '2026-08-10',
    amount: 3500,
    status: 'paid',
    paymentMethod: 'Easypaisa Online',
    paidAt: '2026-08-03T11:20:00Z',
    transactionRef: 'EP-9812440192',
    receiptUrl: '/receipts/inv-2026-0841.pdf',
  },
  {
    id: 'inv_2026_07',
    invoiceNumber: 'INV-2026-0732',
    month: 'July 2026',
    issueDate: '2026-07-01',
    dueDate: '2026-07-10',
    amount: 3500,
    status: 'paid',
    paymentMethod: 'Nayapay Wallet',
    paidAt: '2026-07-02T14:15:00Z',
    transactionRef: 'NP-4820199411',
    receiptUrl: '/receipts/inv-2026-0732.pdf',
  },
  {
    id: 'inv_2026_06',
    invoiceNumber: 'INV-2026-0619',
    month: 'June 2026',
    issueDate: '2026-06-01',
    dueDate: '2026-06-10',
    amount: 3500,
    status: 'paid',
    paymentMethod: 'JazzCash Merchant',
    paidAt: '2026-06-04T09:40:00Z',
    transactionRef: 'JC-1948201201',
    receiptUrl: '/receipts/inv-2026-0619.pdf',
  },
];

export const mockCustomerTickets: CustomerTicket[] = [
  {
    id: 'tkt_8491',
    ticketNumber: 'TKT-2026-8491',
    category: 'fiber_break',
    title: 'Optical Signal Degradation on F-10 Drop Line',
    description: 'LOS red light blinking intermittently after thunderstorm. Optical power dropped below threshold.',
    status: 'in_progress',
    priority: 'urgent',
    createdAt: '2026-08-25T10:40:00Z',
    ettr: '24 mins remaining',
    assignedTechnician: {
      name: 'Eng. Imran Khan',
      vanCode: 'Van 04 (Fiber Splicing)',
      phone: '+92 321 9876543',
      distanceEta: '1.2 km away (ETA: 4 mins)',
      currentStage: 'en_route',
    },
  },
  {
    id: 'tkt_7912',
    ticketNumber: 'TKT-2026-7912',
    category: 'router_config',
    title: '5 GHz Wi-Fi Channel Frequency Optimization',
    description: 'Requested channel switch to 5.8 GHz Band 4 for lower interference.',
    status: 'closed',
    priority: 'normal',
    createdAt: '2026-07-18T14:20:00Z',
    ettr: 'Resolved in 18 mins',
    resolutionNotes: 'Configured router 5GHz radio to Channel 149 with 80MHz bandwidth remotely via TR-069.',
    resolvedAt: '2026-07-18T14:38:00Z',
  },
];

export const mockCustomerChatMessages: CustomerChatMessage[] = [
  {
    id: 'cmsg_1',
    sender: 'customer',
    senderName: 'Ali Hassan',
    text: 'Hello, my router LOS light is showing red and internet is offline.',
    timestamp: '10:40 AM',
    status: 'read',
  },
  {
    id: 'cmsg_2',
    sender: 'agent',
    senderName: 'NOC Lead (Moiz)',
    text: 'Hello Ali, SmartOLT telemetry detected an optical attenuation cut on PON-4 (-32.54 dBm). Trouble Ticket #8491 generated and Mobile Van 04 dispatched.',
    timestamp: '10:41 AM',
    status: 'read',
  },
  {
    id: 'cmsg_3',
    sender: 'system',
    senderName: 'Prime Dispatch AI',
    text: 'Field Splicer Eng. Imran Khan (Van 04) accepted the job and is en route with OTDR test kit.',
    timestamp: '10:42 AM',
    status: 'read',
  },
];

export const mockPaymentGateways: PaymentGatewayChannel[] = [
  {
    id: 'easypaisa',
    name: 'Easypaisa Mobile Account',
    accountNumber: '0300-1234567',
    title: 'Prime Networks Pvt Ltd',
    type: 'mobile_wallet',
  },
  {
    id: 'jazzcash',
    name: 'JazzCash Wallet / Merchant',
    accountNumber: '0301-9876543 (Till: 849102)',
    title: 'Prime Networks Billing',
    type: 'mobile_wallet',
  },
  {
    id: 'nayapay',
    name: 'Nayapay Quick Pay',
    accountNumber: '@primenetworks',
    title: 'Prime Networks Digital',
    type: 'fintech',
  },
  {
    id: 'bank_transfer',
    name: 'Bank Alfalah / HBL Direct Transfer',
    accountNumber: 'PK36ALFH00129482010029',
    title: 'Prime Networks Pvt Ltd - Operations',
    type: 'bank_transfer',
  },
];
