export interface PermissionCategorySeed {
  name: string;
  slug: string;
  order: number;
}

export interface PermissionSeed {
  cat: string;
  slug: string;
  name: string;
}

export const DEMO_PERMISSION_CATEGORIES: PermissionCategorySeed[] = [
  { name: 'Live Chat Management', slug: 'chat', order: 1 },
  { name: 'Trouble Tickets & Complaints', slug: 'ticket', order: 2 },
  { name: 'Customer 360 & CRM', slug: 'customer', order: 3 },
  { name: 'User & Staff Management', slug: 'user', order: 4 },
  { name: 'Branch Operations', slug: 'branch', order: 5 },
  { name: 'Network & Hardware Diagnostics', slug: 'network', order: 6 },
  { name: 'Billing & Accounting Ledger', slug: 'billing', order: 7 },
  { name: 'Reports & Analytics', slug: 'reports', order: 8 },
  { name: 'Company Settings & Branding', slug: 'settings', order: 9 },
];

export const DEMO_PERMISSIONS_LIST: PermissionSeed[] = [
  // Chat Actions & UI Controls
  { cat: 'chat', slug: 'chat.view', name: 'View Live Chats' },
  { cat: 'chat', slug: 'chat.send', name: 'Send Chat Messages' },
  { cat: 'chat', slug: 'chat.assign', name: 'Assign Chat Conversations' },
  { cat: 'chat', slug: 'chat.transfer', name: 'Transfer Chat to Agent/Dept' },
  { cat: 'chat', slug: 'chat.close', name: 'Close Chat with Outcome' },
  { cat: 'chat', slug: 'chat.delete', name: 'Delete Chat Message or Thread' },
  { cat: 'chat', slug: 'chat.export', name: 'Export Chat Transcripts' },
  {
    cat: 'chat',
    slug: 'chat.view_internal_notes',
    name: 'View Private Staff Notes',
  },
  {
    cat: 'chat',
    slug: 'chat.add_internal_note',
    name: 'Add Private Staff Notes',
  },
  {
    cat: 'chat',
    slug: 'chat.manage_quick_replies',
    name: 'Manage Canned Quick Replies',
  },

  // Trouble Ticket Actions & UI Controls
  { cat: 'ticket', slug: 'ticket.view', name: 'View Trouble Tickets' },
  {
    cat: 'ticket',
    slug: 'ticket.create',
    name: 'Create Complaints & Work Orders',
  },
  { cat: 'ticket', slug: 'ticket.assign', name: 'Dispatch & Assign Engineers' },
  {
    cat: 'ticket',
    slug: 'ticket.update_status',
    name: 'Update Ticket Status & Notes',
  },
  {
    cat: 'ticket',
    slug: 'ticket.resolve',
    name: 'Resolve Ticket with Evidence',
  },
  { cat: 'ticket', slug: 'ticket.close', name: 'Close & Verify Tickets' },
  { cat: 'ticket', slug: 'ticket.delete', name: 'Delete Trouble Tickets' },
  { cat: 'ticket', slug: 'ticket.export', name: 'Export Tickets to CSV/Excel' },

  // Customer 360 & CRM Actions & UI Controls
  { cat: 'customer', slug: 'customer.view', name: 'View Customer Directory' },
  {
    cat: 'customer',
    slug: 'customer.view_360',
    name: 'View Customer 360° Diagnostics',
  },
  { cat: 'customer', slug: 'customer.create', name: 'Register New Customers' },
  { cat: 'customer', slug: 'customer.edit', name: 'Edit Customer Information' },
  {
    cat: 'customer',
    slug: 'customer.delete',
    name: 'Disconnect / Terminate Customers',
  },
  {
    cat: 'customer',
    slug: 'customer.export',
    name: 'Export Customer Directory to CSV',
  },

  // User / Staff Management Actions & UI Controls
  { cat: 'user', slug: 'user.view', name: 'View Staff Directory' },
  { cat: 'user', slug: 'user.create', name: 'Create Staff Users' },
  { cat: 'user', slug: 'user.edit', name: 'Edit Staff Details' },
  {
    cat: 'user',
    slug: 'user.delete',
    name: 'Deactivate / Delete Staff Accounts',
  },
  {
    cat: 'user',
    slug: 'user.manage_permissions',
    name: 'Manage Granular RBAC Permissions',
  },

  // Branch Operations
  { cat: 'branch', slug: 'branch.view', name: 'View Branches' },
  { cat: 'branch', slug: 'branch.manage', name: 'Create & Edit Branches' },
  { cat: 'branch', slug: 'branch.delete', name: 'Delete Branch Offices' },

  // Network & Hardware Diagnostic Actions
  {
    cat: 'network',
    slug: 'network.diagnostics',
    name: 'View MikroTik & OLT Signal Diagnostics',
  },
  {
    cat: 'network',
    slug: 'network.reboot_onu',
    name: 'Remote Reboot ONU / PPPoE Reset',
  },
  {
    cat: 'network',
    slug: 'network.reset_mac',
    name: 'Reset PPPoE MAC Binding',
  },

  // Billing & Accounting Actions
  {
    cat: 'billing',
    slug: 'billing.view',
    name: 'View Billing Ledger & Invoices',
  },
  {
    cat: 'billing',
    slug: 'billing.approve',
    name: 'Approve Payment Recharges',
  },
  {
    cat: 'billing',
    slug: 'billing.refund',
    name: 'Issue Customer Balance Refunds',
  },
  {
    cat: 'billing',
    slug: 'billing.manage_packages',
    name: 'Create & Edit Internet Packages',
  },

  // Reports & Analytics
  {
    cat: 'reports',
    slug: 'reports.view_chat',
    name: 'View Helpdesk Chat Analytics',
  },
  {
    cat: 'reports',
    slug: 'reports.view_tickets',
    name: 'View Ticket SLA & Outage Reports',
  },
  {
    cat: 'reports',
    slug: 'reports.export',
    name: 'Export Financial & Operational Reports',
  },

  // Company Settings & Branding
  {
    cat: 'settings',
    slug: 'settings.view',
    name: 'View Organization Settings',
  },
  {
    cat: 'settings',
    slug: 'settings.edit',
    name: 'Edit Company Branding & General Settings',
  },
  {
    cat: 'settings',
    slug: 'settings.working_hours',
    name: 'Configure Weekly Working Hours',
  },
];
