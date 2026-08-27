export interface TroubleTicket {
  id: string;
  ticketNo: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  pppoeUsername: string;
  branchId: string;
  branchName: string;
  category: "Fiber Break" | "High Optical Attenuation" | "Router Fault" | "New Installation" | "Payment Dispute";
  priority: "Critical" | "High" | "Normal" | "Low";
  status: "Open" | "Assigned" | "In Progress" | "Resolved" | "Closed";
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
    category: "High Optical Attenuation",
    priority: "High",
    status: "In Progress",
    assignedDepartments: ["Field Operations", "NOC"],
    assignedEngineers: ["Usman Ali (Van #04)"],
    ettrHours: 2,
    slaExpiresAt: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    isSlaBreached: false,
    opticalRxDbm: -19.24,
    description: "Optical drop detected on Splitter #4.",
    createdAt: new Date().toISOString(),
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
    taskNo: "WO-7712",
    title: "Doorstep Bill Recovery (PKR 3,850)",
    type: "Doorstep Cash Recovery",
    subscriberCode: "PK-88310",
    subscriberName: "Zainab Bibi",
    address: "Plaza 4, Main Blvd, Gulberg III",
    priority: "Normal",
    assignedTo: "Bilal Hassan",
    vanNo: "Bike #03",
    status: "todo",
    dueAt: "Today, 06:00 PM",
  },
];

export const MOCK_SLA_RULES: SlaRule[] = [
  {
    id: "sla-crit",
    priority: "Critical",
    targetFirstResponseMins: 5,
    targetResolutionHours: 1,
    autoEscalateAfterMins: 15,
    escalateToRole: "NOC Lead Engineer",
    notifyChannels: ["SMS", "WhatsApp Alert", "Dashboard Audio Alarm"],
  },
  {
    id: "sla-high",
    priority: "High",
    targetFirstResponseMins: 15,
    targetResolutionHours: 4,
    autoEscalateAfterMins: 30,
    escalateToRole: "Branch Manager",
    notifyChannels: ["Dashboard Notification", "Email"],
  },
  {
    id: "sla-norm",
    priority: "Normal",
    targetFirstResponseMins: 30,
    targetResolutionHours: 12,
    autoEscalateAfterMins: 60,
    escalateToRole: "Helpdesk Supervisor",
    notifyChannels: ["Dashboard Notification"],
  },
];
