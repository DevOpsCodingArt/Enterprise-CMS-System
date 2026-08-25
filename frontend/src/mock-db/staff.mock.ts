export interface MockStaffUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  username: string;
  department: 'Helpdesk' | 'NOC' | 'Field Operations' | 'Accounts' | 'Administration';
  designation: string;
  branchId: string;
  branchName: string;
  roleCode: string;
  isOnline: boolean;
  activeChatsCount: number;
  status: 'Active' | 'On Leave' | 'Suspended';
}

export const mockStaffUsers: MockStaffUser[] = [
  {
    id: 'usr_01',
    fullName: 'Moiz Ahmad',
    email: 'ceo@primenetworks.pk',
    phone: '+92 300 1234567',
    username: 'moiz.ceo',
    department: 'Administration',
    designation: 'Managing Director & CEO',
    branchId: 'ALL',
    branchName: 'Corporate HQ (All Branches)',
    roleCode: 'COMPANY_OWNER',
    isOnline: true,
    activeChatsCount: 0,
    status: 'Active',
  },
  {
    id: 'usr_02',
    fullName: 'Bilal Hassan',
    email: 'bilal.noc@primenetworks.pk',
    phone: '+92 301 2345678',
    username: 'bilal.noc',
    department: 'NOC',
    designation: 'Senior NOC Lead Engineer',
    branchId: 'br_isb_blue',
    branchName: 'Blue Area Corporate Core',
    roleCode: 'NOC_LEAD',
    isOnline: true,
    activeChatsCount: 2,
    status: 'Active',
  },
  {
    id: 'usr_03',
    fullName: 'Ayesha Khan',
    email: 'ayesha.hd@primenetworks.pk',
    phone: '+92 322 3456789',
    username: 'ayesha.k',
    department: 'Helpdesk',
    designation: 'Senior Helpdesk Support Officer',
    branchId: 'br_isb_f10',
    branchName: 'Islamabad F-10 Main Hub',
    roleCode: 'HELPDESK_AGENT',
    isOnline: true,
    activeChatsCount: 4,
    status: 'Active',
  },
  {
    id: 'usr_04',
    fullName: 'Imran Khan',
    email: 'imran.field@primenetworks.pk',
    phone: '+92 333 4567890',
    username: 'imran.splicer',
    department: 'Field Operations',
    designation: 'Fiber Splicer (Van 04)',
    branchId: 'br_isb_f10',
    branchName: 'Islamabad F-10 Main Hub',
    roleCode: 'FIELD_TECHNICIAN',
    isOnline: true,
    activeChatsCount: 1,
    status: 'Active',
  },
  {
    id: 'usr_05',
    fullName: 'Sana Malik',
    email: 'sana.acc@primenetworks.pk',
    phone: '+92 311 5678901',
    username: 'sana.m',
    department: 'Accounts',
    designation: 'Billing & Ledger Officer',
    branchId: 'br_isb_f10',
    branchName: 'Islamabad F-10 Main Hub',
    roleCode: 'ACCOUNTS_OFFICER',
    isOnline: true,
    activeChatsCount: 0,
    status: 'Active',
  },
];
