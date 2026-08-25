export interface MockRole {
  id: string;
  name: string;
  usersCount: number;
  isSystem: boolean;
}

export interface PermissionMatrixRow {
  module: string;
  description: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canTransfer: boolean;
  canExport: boolean;
}

export const mockRoles: MockRole[] = [
  { id: 'role_owner', name: 'Company Owner (Full Root)', usersCount: 2, isSystem: true },
  { id: 'role_manager', name: 'Branch Regional Manager', usersCount: 6, isSystem: false },
  { id: 'role_helpdesk', name: 'Helpdesk & Support Officer', usersCount: 12, isSystem: false },
  { id: 'role_field', name: 'Field Splicer & Tech Lead', usersCount: 40, isSystem: false },
  { id: 'role_accounts', name: 'Accounts & Billing Officer', usersCount: 4, isSystem: false },
];

export const mockPermissionMatrix: Record<string, PermissionMatrixRow[]> = {
  role_helpdesk: [
    {
      module: 'Live Chat & Prime Desk',
      description: 'Customer chat stream, typing indicators, read receipts',
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canTransfer: true,
      canExport: false,
    },
    {
      module: 'Customer Directory & 360°',
      description: 'Subscriber lookups, SmartOLT telemetry, PPPoE status',
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canTransfer: false,
      canExport: false,
    },
    {
      module: 'Service Trouble Tickets',
      description: 'Escalations to field dispatch and ticket creation',
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canTransfer: true,
      canExport: false,
    },
    {
      module: 'Branch Infrastructure',
      description: 'Regional distribution hubs and subnets overview',
      canView: true,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canTransfer: false,
      canExport: false,
    },
    {
      module: 'Staff & Team Management',
      description: 'Provision staff members and invite officers',
      canView: false,
      canCreate: false,
      canEdit: false,
      canDelete: false,
      canTransfer: false,
      canExport: false,
    },
  ],
  role_manager: [
    {
      module: 'Live Chat & Prime Desk',
      description: 'Customer chat stream, typing indicators, read receipts',
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canTransfer: true,
      canExport: true,
    },
    {
      module: 'Customer Directory & 360°',
      description: 'Subscriber lookups, SmartOLT telemetry, PPPoE status',
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canTransfer: true,
      canExport: true,
    },
    {
      module: 'Service Trouble Tickets',
      description: 'Escalations to field dispatch and ticket creation',
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canTransfer: true,
      canExport: true,
    },
    {
      module: 'Branch Infrastructure',
      description: 'Regional distribution hubs and subnets overview',
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canTransfer: false,
      canExport: true,
    },
    {
      module: 'Staff & Team Management',
      description: 'Provision staff members and invite officers',
      canView: true,
      canCreate: true,
      canEdit: true,
      canDelete: false,
      canTransfer: false,
      canExport: true,
    },
  ],
};
