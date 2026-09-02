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
    | 'onu_failure'
    | 'router_config'
    | 'wire_damage'
    | 'slow_speed'
    | 'new_installation'
    | 'relocation'
    | 'billing_inquiry'
    | 'recharge_verification'
    | 'other';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status:
    | 'open'
    | 'assigned'
    | 'in_progress'
    | 'pending_field'
    | 'resolved'
    | 'closed'
    | 'cancelled';
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
