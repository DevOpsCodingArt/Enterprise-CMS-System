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
  { name: 'Reports & Analytics', slug: 'reports', order: 7 },
  { name: 'Company Settings & Branding', slug: 'settings', order: 8 },
];

export const DEMO_PERMISSIONS_LIST: PermissionSeed[] = [
  // Chat
  { cat: 'chat', slug: 'chat.view', name: 'View Live Chats' },
  { cat: 'chat', slug: 'chat.send', name: 'Send Chat Messages' },
  { cat: 'chat', slug: 'chat.assign', name: 'Assign Chat Conversations' },
  { cat: 'chat', slug: 'chat.transfer', name: 'Transfer Chat to Agent/Dept' },
  { cat: 'chat', slug: 'chat.close', name: 'Close Chat with Outcome' },
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

  // Tickets
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

  // Customer CRM
  { cat: 'customer', slug: 'customer.view', name: 'View Customer Directory' },
  {
    cat: 'customer',
    slug: 'customer.view_360',
    name: 'View Customer 360° Diagnostics',
  },
  { cat: 'customer', slug: 'customer.create', name: 'Register New Customers' },
  { cat: 'customer', slug: 'customer.edit', name: 'Edit Customer Information' },

  // User / Staff
  { cat: 'user', slug: 'user.view', name: 'View Staff Directory' },
  { cat: 'user', slug: 'user.create', name: 'Create Staff Users' },
  { cat: 'user', slug: 'user.edit', name: 'Edit Staff Details' },
  {
    cat: 'user',
    slug: 'user.manage_permissions',
    name: 'Manage RBAC Permissions',
  },

  // Branch
  { cat: 'branch', slug: 'branch.view', name: 'View Branches' },
  { cat: 'branch', slug: 'branch.manage', name: 'Create & Edit Branches' },

  // Network Diagnostics
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

  // Reports
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

  // Settings
  {
    cat: 'settings',
    slug: 'settings.branding',
    name: 'Update Company Branding & Colors',
  },
  {
    cat: 'settings',
    slug: 'settings.working_hours',
    name: 'Configure Working Hours',
  },
];
