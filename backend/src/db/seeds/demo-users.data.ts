export interface DemoStaffUser {
  key: string;
  branchCode: string;
  email: string;
  username: string;
  fullName: string;
  displayName: string;
  userType: 'company_owner' | 'staff';
  department:
    'management' | 'helpdesk' | 'noc' | 'field_operations' | 'billing';
  designation: string;
  isActive: boolean;
  isOnline: boolean;
}

export const DEMO_STAFF_USERS: DemoStaffUser[] = [
  {
    key: 'admin',
    branchCode: 'ISB-01',
    email: 'admin@primenetworks.pk',
    username: 'admin',
    fullName: 'Tariq Mehmood',
    displayName: 'Tariq (Admin)',
    userType: 'company_owner',
    department: 'management',
    designation: 'CEO / Operations Director',
    isActive: true,
    isOnline: true,
  },
  {
    key: 'supervisor',
    branchCode: 'ISB-01',
    email: 'supervisor@primenetworks.pk',
    username: 'supervisor',
    fullName: 'Khurram Shahzad',
    displayName: 'Khurram (Supervisor)',
    userType: 'staff',
    department: 'helpdesk',
    designation: 'Support Operations Supervisor',
    isActive: true,
    isOnline: true,
  },
  {
    key: 'agent',
    branchCode: 'ISB-01',
    email: 'agent@primenetworks.pk',
    username: 'agent.ali',
    fullName: 'Ali Raza',
    displayName: 'Agent Ali',
    userType: 'staff',
    department: 'helpdesk',
    designation: 'Helpdesk Senior CSR',
    isActive: true,
    isOnline: true,
  },
  {
    key: 'field',
    branchCode: 'RWP-01',
    email: 'field@primenetworks.pk',
    username: 'field.usman',
    fullName: 'Usman Splicer',
    displayName: 'Usman (Field Tech)',
    userType: 'staff',
    department: 'field_operations',
    designation: 'Senior Fiber Splicer',
    isActive: true,
    isOnline: false,
  },
];
