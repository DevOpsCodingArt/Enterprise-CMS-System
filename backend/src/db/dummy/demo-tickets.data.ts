export interface DemoTicketActivity {
  activityType:
    | 'created'
    | 'status_changed'
    | 'reassigned'
    | 'priority_changed'
    | 'internal_note'
    | 'material_used';
  comment: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}

export interface DemoTicket {
  ticketNumber: string;
  customerCode: string;
  branchCode: string;
  assignedUsername: string;
  category:
    | 'fiber_break'
    | 'slow_speed'
    | 'router_config'
    | 'billing'
    | 'relocation'
    | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_customer' | 'resolved' | 'closed';
  title: string;
  description: string;
  assignedDepartment: string;
  materialUsed: string;
  latitude: string;
  longitude: string;
  activities: DemoTicketActivity[];
}

export const DEMO_TICKETS: DemoTicket[] = [
  {
    ticketNumber: 'TKT-2026-0001',
    customerCode: 'CUS-1003',
    branchCode: 'RWP-01',
    assignedUsername: 'field.usman',
    category: 'fiber_break',
    priority: 'urgent',
    status: 'in_progress',
    title: 'Red LOS Light - Total Optical Signal Loss in Saddar RWP',
    description:
      'Customer reports sudden internet disconnection. Optical signal degraded to -27.8 dBm (LOS blinking red). Drop cable suspected to be damaged near street pole #14.',
    assignedDepartment: 'field_operations',
    materialUsed: '150m 1-Core Drop Cable, 2x SC Fast Connectors',
    latitude: '33.5992',
    longitude: '73.0545',
    activities: [
      {
        activityType: 'created',
        comment:
          'Trouble Ticket generated from customer inquiry. Dispatched to Rawalpindi Field Team.',
      },
      {
        activityType: 'status_changed',
        comment:
          'Engineer reached Saddar site. Located cable damage near street 4.',
        oldValues: { status: 'open' },
        newValues: { status: 'in_progress' },
      },
    ],
  },
];
