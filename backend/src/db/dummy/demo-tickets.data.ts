export interface DemoTicketActivity {
  activityType:
    | 'created'
    | 'status_changed'
    | 'reassigned'
    | 'priority_changed'
    | 'internal_note'
    | 'otdr_test'
    | 'pon_shifted'
    | 'material_used'
    | 'resolved'
    | 'closed';
  comment: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
}

export interface DemoTicket {
  ticketNumber: string;
  ticketScope:
    'subscriber' | 'main_line' | 'backbone' | 'pon_network' | 'node_outage';
  customerCode?: string;
  branchCode: string;
  assignedUsername: string;
  category:
    | 'fiber_break'
    | 'main_line_break'
    | 'backbone_cut'
    | 'two_way_issue'
    | 'pon_shifting'
    | 'macro_bend'
    | 'rogue_onu_isolation'
    | 'splitter_fault'
    | 'joint_closure_damage'
    | 'onu_failure'
    | 'router_config'
    | 'wire_damage'
    | 'slow_speed'
    | 'new_installation'
    | 'relocation'
    | 'olt_card_failure'
    | 'core_switch_fault'
    | 'power_outage'
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
  areaAffected?: string;
  affectedSubscribersCount?: number;
  oltPonPort?: string;
  sourcePonPort?: string;
  destinationPonPort?: string;
  splitterId?: string;
  coreCountAffected?: number;
  cableType?: string;
  otdrBreakDistanceMeters?: string;
  opticalFaultType?: string;
  materialUsed?: string;
  latitude?: string;
  longitude?: string;
  activities: DemoTicketActivity[];
}

export const DEMO_TICKETS: DemoTicket[] = [
  {
    ticketNumber: 'INC-260902-0001',
    ticketScope: 'subscriber',
    customerCode: 'CUS-1003',
    branchCode: 'RWP-01',
    assignedUsername: 'field.usman',
    category: 'fiber_break',
    priority: 'urgent',
    status: 'in_progress',
    title: 'Red LOS Light - Subscriber Drop Cable Break in Saddar',
    description:
      'Customer reports sudden internet disconnection. Optical signal degraded to -27.8 dBm (LOS blinking red). Drop cable suspected to be cut near street pole #14.',
    assignedDepartment: 'field_operations',
    areaAffected: 'Saddar, Rawalpindi (Street 4)',
    affectedSubscribersCount: 1,
    oltPonPort: 'EPON0/3:2',
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
          'Engineer reached Saddar site. Located drop cable cut near pole #14.',
        oldValues: { status: 'open' },
        newValues: { status: 'in_progress' },
      },
    ],
  },
  {
    ticketNumber: 'INC-260902-0002',
    ticketScope: 'main_line',
    branchCode: 'ISB-01',
    assignedUsername: 'field.usman',
    category: 'main_line_break',
    priority: 'urgent',
    status: 'in_progress',
    title: '🚨 96-Core Backbone Feeder Fiber Cut on Kashmir Highway',
    description:
      'Road construction excavator cut primary 96-core armored underground feeder. Multiple GPON feeder rings down. Main Line Splicing Van #2 on-site with OTDR.',
    assignedDepartment: 'main_line_splicing',
    areaAffected: 'Kashmir Highway / Sector G-9 & G-10 Corridor',
    affectedSubscribersCount: 380,
    oltPonPort: 'OLT-ISB-CORE-01 / Trunk Ring 1',
    coreCountAffected: 96,
    cableType: 'Underground Armored Feeder Cable',
    otdrBreakDistanceMeters: '1420.50',
    materialUsed:
      '96-Core Fiber Joint Closure, 4x Heat Shrink Tubes, OTDR Splicing Kit',
    latitude: '33.6844',
    longitude: '73.0479',
    activities: [
      {
        activityType: 'created',
        comment:
          'NOC Telemetry alarm: Loss of Signal on Trunk Ring 1. High-priority Main Line ticket dispatched.',
      },
      {
        activityType: 'otdr_test',
        comment:
          'OTDR trace indicates physical glass cut at 1420.5 meters from Central Office OLT rack.',
      },
    ],
  },
  {
    ticketNumber: 'INC-260902-0003',
    ticketScope: 'pon_network',
    branchCode: 'ISB-01',
    assignedUsername: 'field.usman',
    category: 'pon_shifting',
    priority: 'normal',
    status: 'assigned',
    title: '🔄 PON Shifting Work Order: Shift Sector F-10 Splitters to OLT-02',
    description:
      'High bandwidth saturation on Port GPON0/1:4 (62 active ONUs). Shift 1:16 secondary splitter (FAT-04) to under-utilized Port GPON0/2:1 to re-balance optical capacity.',
    assignedDepartment: 'main_line_splicing',
    areaAffected: 'Sector F-10/2 Street 12 to 18',
    affectedSubscribersCount: 16,
    oltPonPort: 'GPON0/1:4',
    sourcePonPort: 'GPON0/1:4',
    destinationPonPort: 'GPON0/2:1',
    splitterId: 'F-10/2-FAT-04',
    latitude: '33.6934',
    longitude: '73.0112',
    activities: [
      {
        activityType: 'created',
        comment:
          'Capacity re-balancing ticket generated by Network Planning team.',
      },
    ],
  },
  {
    ticketNumber: 'INC-260902-0004',
    ticketScope: 'subscriber',
    customerCode: 'CUS-1002',
    branchCode: 'ISB-01',
    assignedUsername: 'field.usman',
    category: 'two_way_issue',
    priority: 'high',
    status: 'in_progress',
    title: '⚡ 2-Way Optical Power Discrepancy & High Reflection in Blue Area',
    description:
      'OLT telemetry shows high upstream transmission loss (RX: -18.2 dBm OK, TX to OLT: -29.4 dBm degraded). Suspected dirty APC ferrule or macro-bend in building riser.',
    assignedDepartment: 'field_operations',
    areaAffected: 'Evacuee Trust Complex, Blue Area',
    affectedSubscribersCount: 1,
    oltPonPort: 'GPON0/2:1',
    opticalFaultType: 'two_way_discrepancy',
    materialUsed: 'Optical Fiber Click Cleaner, 1x SC/APC Patchcord 3m',
    latitude: '33.7214',
    longitude: '73.0782',
    activities: [
      {
        activityType: 'created',
        comment:
          'SmartOLT automated 2-way reflection warning ticket triggered.',
      },
    ],
  },
];
