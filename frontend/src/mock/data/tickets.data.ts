export interface TroubleTicket {
  id: string;
  ticketNo: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  pppoeUsername: string;
  branchId: string;
  branchName: string;
  category: "Fiber Break" | "High Optical Attenuation" | "Router Fault" | "New Installation" | "Payment Dispute" | "Speed Degradation";
  priority: "Critical" | "High" | "Normal" | "Low";
  status: "Open" | "Assigned" | "In Progress" | "Resolved" | "Closed" | "Expired";
  assignedDepartments: string[];
  assignedEngineers: string[];
  ettrHours: number;
  slaExpiresAt: string;
  isSlaBreached: boolean;
  opticalRxDbm?: number;
  description: string;
  createdAt: string;
}

export interface WorkOrderTask {
  id: string;
  taskNo: string;
  title: string;
  type: "Fiber Drop Installation" | "OTDR Splicing Repair" | "Router Replacement" | "Doorstep Cash Recovery";
  subscriberCode: string;
  subscriberName: string;
  address: string;
  priority: "Critical" | "High" | "Normal";
  assignedTo: string;
  vanNo: string;
  status: "todo" | "assigned" | "en_route" | "in_progress" | "completed";
  dueAt: string;
}

export interface SlaRule {
  id: string;
  priority: "Critical" | "High" | "Normal" | "Low";
  targetFirstResponseMins: number;
  targetResolutionHours: number;
  autoEscalateAfterMins: number;
  escalateToRole: string;
  notifyChannels: string[];
}

export const MOCK_TICKETS: TroubleTicket[] = [
  {
    id: "tkt-01",
    ticketNo: "TK-8842",
    customerId: "cus-84920",
    customerName: "Ali Hassan",
    customerPhone: "+92 300 8594021",
    pppoeUsername: "ali_f10",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    category: "Fiber Break",
    priority: "High",
    status: "In Progress",
    assignedDepartments: ["Field Operations", "NOC"],
    assignedEngineers: ["Usman Ali (Lead Splicer)"],
    ettrHours: 2,
    slaExpiresAt: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    isSlaBreached: false,
    opticalRxDbm: -32.4,
    description: "Optical loss of signal (LOS) detected on Splitter #4 drop cable.",
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
  {
    id: "tkt-02",
    ticketNo: "TK-7421",
    customerId: "cus-9921",
    customerName: "Dr. Tariq Mehmood",
    customerPhone: "+92 321 4455667",
    pppoeUsername: "dr_tariq_f7",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    category: "High Optical Attenuation",
    priority: "Critical",
    status: "Open",
    assignedDepartments: ["Field Operations"],
    assignedEngineers: ["Bilal Hassan (Technician)"],
    ettrHours: 1,
    slaExpiresAt: new Date(Date.now() + 1 * 3600 * 1000).toISOString(),
    isSlaBreached: false,
    opticalRxDbm: -29.8,
    description: "Frequent disconnections. Optical power degraded to -29.8 dBm on FAT-F7-02.",
    createdAt: new Date(Date.now() - 1800 * 1000).toISOString(),
  },
  {
    id: "tkt-03",
    ticketNo: "TK-6205",
    customerId: "cus-8831",
    customerName: "Fatima Zahra",
    customerPhone: "+92 333 5566778",
    pppoeUsername: "fatima_e11",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    category: "Router Fault",
    priority: "Normal",
    status: "In Progress",
    assignedDepartments: ["Customer Support"],
    assignedEngineers: ["Imran Splicer (Drop Team)"],
    ettrHours: 4,
    slaExpiresAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    isSlaBreached: false,
    opticalRxDbm: -18.2,
    description: "5GHz WiFi SSID disabled on Huawei Dual-band ONT. Remote TR-069 config required.",
    createdAt: new Date(Date.now() - 7200 * 1000).toISOString(),
  },
  {
    id: "tkt-04",
    ticketNo: "TK-5912",
    customerId: "cus-7742",
    customerName: "Kamran Akram",
    customerPhone: "+92 301 9988776",
    pppoeUsername: "kamran_f8",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    category: "Speed Degradation",
    priority: "Normal",
    status: "Resolved",
    assignedDepartments: ["NOC Core"],
    assignedEngineers: ["Farhan NOC (Remote Desk)"],
    ettrHours: 3,
    slaExpiresAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    isSlaBreached: false,
    opticalRxDbm: -17.5,
    description: "Subscriber reported bufferbloat on 50 Mbps profile. Bandwidth shaper recalibrated.",
    createdAt: new Date(Date.now() - 14400 * 1000).toISOString(),
  },
  {
    id: "tkt-05",
    ticketNo: "TK-4820",
    customerId: "cus-6631",
    customerName: "Ayesha Siddiqui",
    customerPhone: "+92 345 1122334",
    pppoeUsername: "ayesha_g9",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    category: "Fiber Break",
    priority: "Critical",
    status: "Expired",
    assignedDepartments: ["Field Operations"],
    assignedEngineers: ["Usman Ali (Lead Splicer)"],
    ettrHours: 1,
    slaExpiresAt: new Date(Date.now() - 7200 * 1000).toISOString(),
    isSlaBreached: true,
    opticalRxDbm: -34.0,
    description: "Road excavation severed 4-core feeder fiber. Emergency joint enclosure required.",
    createdAt: new Date(Date.now() - 28800 * 1000).toISOString(),
  },
  {
    id: "tkt-06",
    ticketNo: "TK-3914",
    customerId: "cus-5520",
    customerName: "Muhammad Bilal",
    customerPhone: "+92 312 8877665",
    pppoeUsername: "bilal_g11",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    category: "Payment Dispute",
    priority: "Low",
    status: "Resolved",
    assignedDepartments: ["Billing & Recovery"],
    assignedEngineers: ["Farhan NOC (Remote Desk)"],
    ettrHours: 24,
    slaExpiresAt: new Date(Date.now() - 18000 * 1000).toISOString(),
    isSlaBreached: false,
    opticalRxDbm: -19.0,
    description: "Bank transfer verification completed. Radius service reactivated.",
    createdAt: new Date(Date.now() - 43200 * 1000).toISOString(),
  },
  {
    id: "tkt-07",
    ticketNo: "TK-2890",
    customerId: "cus-4411",
    customerName: "Zainab Bibi",
    customerPhone: "+92 334 2233445",
    pppoeUsername: "zainab_f11",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    category: "Speed Degradation",
    priority: "High",
    status: "In Progress",
    assignedDepartments: ["NOC Core", "Field Operations"],
    assignedEngineers: ["Bilal Hassan (Technician)"],
    ettrHours: 2,
    slaExpiresAt: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    isSlaBreached: false,
    opticalRxDbm: -24.5,
    description: "Gaming latency spikes to international gateway. Routing optimized to TW1 route.",
    createdAt: new Date(Date.now() - 5400 * 1000).toISOString(),
  },
  {
    id: "tkt-08",
    ticketNo: "TK-1945",
    customerId: "cus-3309",
    customerName: "Hamza Sheikh",
    customerPhone: "+92 300 7766554",
    pppoeUsername: "hamza_f10",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    category: "High Optical Attenuation",
    priority: "Critical",
    status: "Open",
    assignedDepartments: ["Field Operations"],
    assignedEngineers: ["Imran Splicer (Drop Team)"],
    ettrHours: 1,
    slaExpiresAt: new Date(Date.now() + 1 * 3600 * 1000).toISOString(),
    isSlaBreached: false,
    opticalRxDbm: -31.2,
    description: "FAT adapter loose connection. Technician dispatched for field re-patching.",
    createdAt: new Date(Date.now() - 900 * 1000).toISOString(),
  },
  {
    id: "tkt-09",
    ticketNo: "TK-1523",
    customerId: "cus-2298",
    customerName: "Usman Ghani",
    customerPhone: "+92 322 9988112",
    pppoeUsername: "usman_f6",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    category: "Router Fault",
    priority: "Low",
    status: "Resolved",
    assignedDepartments: ["Customer Support"],
    assignedEngineers: ["Farhan NOC (Remote Desk)"],
    ettrHours: 6,
    slaExpiresAt: new Date(Date.now() - 21600 * 1000).toISOString(),
    isSlaBreached: false,
    opticalRxDbm: -18.8,
    description: "Static IP configuration pushed to client ONT via TR-069 ACS server.",
    createdAt: new Date(Date.now() - 86400 * 1000).toISOString(),
  },
  {
    id: "tkt-10",
    ticketNo: "TK-1102",
    customerId: "cus-1187",
    customerName: "Rehan Aslam",
    customerPhone: "+92 345 6677889",
    pppoeUsername: "rehan_f10",
    branchId: "br-isb-01",
    branchName: "Islamabad Core (F-10 HQ)",
    category: "Fiber Break",
    priority: "Critical",
    status: "In Progress",
    assignedDepartments: ["Field Operations"],
    assignedEngineers: ["Usman Ali (Lead Splicer)"],
    ettrHours: 1,
    slaExpiresAt: new Date(Date.now() + 1 * 3600 * 1000).toISOString(),
    isSlaBreached: false,
    opticalRxDbm: -35.0,
    description: "Subscriber drop cable cut during tree pruning. Splicer dispatched with 100m drop wire.",
    createdAt: new Date(Date.now() - 1200 * 1000).toISOString(),
  },
];

export const MOCK_WORK_ORDERS: WorkOrderTask[] = [
  {
    id: "wo-01",
    taskNo: "WO-8842",
    title: "Emergency Fiber Splicing on Splitter #4",
    type: "OTDR Splicing Repair",
    subscriberCode: "PK-99482",
    subscriberName: "Ahmed Malik",
    address: "House 112, Street 35, Blue Area, Islamabad",
    priority: "Critical",
    assignedTo: "Usman Ali",
    vanNo: "Van #04",
    status: "in_progress",
    dueAt: "Today, 02:00 PM",
  },
  {
    id: "wo-02",
    taskNo: "WO-9921",
    title: "New 50M Drop Installation & ONU Config",
    type: "Fiber Drop Installation",
    subscriberCode: "PK-9921",
    subscriberName: "Dr. Bilal Qureshi",
    address: "House 58, Street 4, Sector F-10/3",
    priority: "High",
    assignedTo: "Imran Splicer",
    vanNo: "Van #02",
    status: "assigned",
    dueAt: "Today, 04:30 PM",
  },
  {
    id: "wo-03",
    taskNo: "WO-7421",
    title: "Optical Power Attenuation Fix at FAT-F7-02",
    type: "OTDR Splicing Repair",
    subscriberCode: "PK-84920",
    subscriberName: "Dr. Tariq Mehmood",
    address: "House 105, St 4, Sector F-7/1",
    priority: "Critical",
    assignedTo: "Bilal Hassan",
    vanNo: "Van #04",
    status: "en_route",
    dueAt: "Today, 01:15 PM",
  },
];

export const MOCK_SLA_RULES: SlaRule[] = [
  {
    id: "sla-p1",
    priority: "Critical",
    targetFirstResponseMins: 10,
    targetResolutionHours: 1,
    autoEscalateAfterMins: 45,
    escalateToRole: "Operations Lead & NOC Manager",
    notifyChannels: ["SMS", "WhatsApp Alert", "Dashboard Alarm"],
  },
  {
    id: "sla-p2",
    priority: "High",
    targetFirstResponseMins: 20,
    targetResolutionHours: 2,
    autoEscalateAfterMins: 90,
    escalateToRole: "Field Operations Supervisor",
    notifyChannels: ["Dashboard Alert", "Email"],
  },
  {
    id: "sla-p3",
    priority: "Normal",
    targetFirstResponseMins: 45,
    targetResolutionHours: 4,
    autoEscalateAfterMins: 180,
    escalateToRole: "Helpdesk Team Lead",
    notifyChannels: ["Dashboard Alert"],
  },
  {
    id: "sla-p4",
    priority: "Low",
    targetFirstResponseMins: 120,
    targetResolutionHours: 24,
    autoEscalateAfterMins: 720,
    escalateToRole: "Account Manager",
    notifyChannels: ["Email"],
  },
];
