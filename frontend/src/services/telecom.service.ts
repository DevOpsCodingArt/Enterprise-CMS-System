import { apiClient } from "@/lib/api";
import type {
  TariffPackage,
  SubscriberRecord,
  TroubleTicket,
  WorkOrderTask,
  SlaRule,
  NewConnectionLead,
  DepartmentRecord,
  StaffUserRecord,
  ShiftRoster,
  AttendanceRecord,
  RbacRole,
  CannedTemplate,
} from "@/types/telecom-entities.types";

function normalizeSubscriber(raw: any): SubscriberRecord {
  if (!raw) return raw;
  const monthly = Number(raw.monthlyFeePkr ?? raw.monthlyBilling ?? 3500);
  const signal = Number(raw.opticalRxDbm ?? raw.onuSignalDbm ?? -19.5);
  const ledger = Number(raw.ledgerBalancePkr ?? 0);
  let dueDay = raw.billingDueDay;
  if (!dueDay && raw.billingExpiryDate) {
    const d = new Date(raw.billingExpiryDate);
    if (!isNaN(d.getDate())) dueDay = d.getDate();
  }
  if (!dueDay) dueDay = 5;

  return {
    ...raw,
    id: raw.id,
    customerCode: raw.customerCode || `SUB-${raw.id?.slice(0, 6) || "001"}`,
    fullName: raw.fullName || raw.name || "Subscriber",
    cnic: raw.cnic || "37405-0000000-0",
    phone: raw.phone || "+92 300 0000000",
    email: raw.email || undefined,
    address: raw.address || "Main Boulevard, Sector F-10, Islamabad",
    branchName: raw.branchName || (raw.branch?.name) || "Islamabad Core (F-10 HQ)",
    packageName: raw.packageName || "50 Mbps Unlimited Fiber",
    monthlyFeePkr: isNaN(monthly) ? 3500 : monthly,
    monthlyBilling: isNaN(monthly) ? 3500 : monthly,
    pppoeUsername: raw.pppoeUsername || raw.username || `user_${raw.customerCode || "sub"}`,
    username: raw.username || raw.pppoeUsername || `user_${raw.customerCode || "sub"}`,
    staticIp: raw.staticIp || raw.currentIp || "103.14.22.84",
    onuSerial: raw.onuSerial || "HWTC-9B2F1048",
    macAddress: raw.macAddress || "48:57:02:9B:2F:10",
    oltHostname: raw.oltHostname || "ISB-F10-OLT-01",
    oltSlotPort: raw.oltSlotPort || raw.oltPonPort || "EPON0/1:4",
    fatBoxNumber: raw.fatBoxNumber || "FAT-F10-12",
    opticalRxDbm: isNaN(signal) ? -19.5 : signal,
    opticalStatus: raw.opticalStatus || (signal < -27 ? "critical" : signal < -24 ? "warning" : "optimal"),
    ledgerBalancePkr: isNaN(ledger) ? 0 : ledger,
    status: raw.status || "active",
    billingDueDay: dueDay,
  };
}

export const telecomService = {
  // 1. Subscribers / CRM
  subscribers: {
    async list(params?: { search?: string; status?: string; page?: number; limit?: number }) {
      const res = await apiClient.get("/customers", { params });
      const items = (res.data?.data?.items || res.data?.data || []) as any[];
      return items.map(normalizeSubscriber);
    },
    async getById(id: string) {
      const res = await apiClient.get(`/customers/${id}`);
      const data = res.data?.data || res.data;
      return data ? normalizeSubscriber(data) : data;
    },
    async get360(id: string) {
      const res = await apiClient.get(`/customers/${id}/360`);
      return res.data?.data || res.data;
    },
    async create(payload: Partial<SubscriberRecord>) {
      const res = await apiClient.post("/customers", payload);
      return res.data?.data || res.data;
    },
    async updateStatus(id: string, status: string, notes?: string) {
      const res = await apiClient.patch(`/customers/${id}/status`, { status, notes });
      return res.data?.data || res.data;
    },
  },

  // 2. Trouble Tickets
  tickets: {
    async list(params?: { search?: string; status?: string; priority?: string; page?: number; limit?: number }) {
      const res = await apiClient.get("/tickets", { params });
      return (res.data?.data?.items || res.data?.data || []) as TroubleTicket[];
    },
    async getById(id: string) {
      const res = await apiClient.get(`/tickets/${id}`);
      return (res.data?.data || res.data) as TroubleTicket;
    },
    async create(payload: any) {
      const res = await apiClient.post("/tickets", payload);
      return res.data?.data || res.data;
    },
    async update(id: string, payload: any) {
      const res = await apiClient.patch(`/tickets/${id}`, payload);
      return res.data?.data || res.data;
    },
    async assign(id: string, assignedTo: string, department?: string) {
      const res = await apiClient.post(`/tickets/${id}/assign`, { assignedTo, department });
      return res.data?.data || res.data;
    },
    async resolve(id: string, notes?: string) {
      const res = await apiClient.post(`/tickets/${id}/resolve`, { resolutionNotes: notes });
      return res.data?.data || res.data;
    },
  },

  // 3. Tariff Packages
  packages: {
    async list() {
      const res = await apiClient.get("/packages");
      return (res.data?.data || res.data || []) as TariffPackage[];
    },
    async create(payload: Partial<TariffPackage>) {
      const res = await apiClient.post("/packages", payload);
      return res.data?.data || res.data;
    },
    async update(id: string, payload: Partial<TariffPackage>) {
      const res = await apiClient.patch(`/packages/${id}`, payload);
      return res.data?.data || res.data;
    },
    async delete(id: string) {
      const res = await apiClient.delete(`/packages/${id}`);
      return res.data?.data || res.data;
    },
  },

  // 4. Connection Leads / CRM
  connections: {
    async list(stage?: string) {
      const res = await apiClient.get("/connections", { params: { stage } });
      return (res.data?.data || res.data || []) as NewConnectionLead[];
    },
    async create(payload: Partial<NewConnectionLead>) {
      const res = await apiClient.post("/connections", payload);
      return res.data?.data || res.data;
    },
    async update(id: string, payload: Partial<NewConnectionLead>) {
      const res = await apiClient.patch(`/connections/${id}`, payload);
      return res.data?.data || res.data;
    },
  },

  // 5. Workforce Management
  workforce: {
    async getDepartments() {
      const res = await apiClient.get("/workforce/departments");
      return (res.data?.data || res.data || []) as DepartmentRecord[];
    },
    async createDepartment(payload: Partial<DepartmentRecord>) {
      const res = await apiClient.post("/workforce/departments", payload);
      return res.data?.data || res.data;
    },
    async getShifts() {
      const res = await apiClient.get("/workforce/shifts");
      return (res.data?.data || res.data || []) as ShiftRoster[];
    },
    async createShift(payload: Partial<ShiftRoster>) {
      const res = await apiClient.post("/workforce/shifts", payload);
      return res.data?.data || res.data;
    },
    async getAttendance(dateStr?: string) {
      const res = await apiClient.get("/workforce/attendance", { params: { date: dateStr } });
      return (res.data?.data || res.data || []) as AttendanceRecord[];
    },
    async clockIn(payload: any) {
      const res = await apiClient.post("/workforce/attendance/clock-in", payload);
      return res.data?.data || res.data;
    },
    async clockOut(id: string) {
      const res = await apiClient.post(`/workforce/attendance/${id}/clock-out`);
      return res.data?.data || res.data;
    },
    async getTasks(status?: string) {
      const res = await apiClient.get("/workforce/tasks", { params: { status } });
      return (res.data?.data || res.data || []) as WorkOrderTask[];
    },
    async updateTaskStatus(id: string, status: string) {
      const res = await apiClient.patch(`/workforce/tasks/${id}/status`, { status });
      return res.data?.data || res.data;
    },
    async getStaff() {
      const res = await apiClient.get("/users");
      const users = res.data?.data?.items || res.data?.data || res.data || [];
      return users.map((u: any) => ({
        id: u.id,
        name: u.fullName || u.displayName || u.username,
        email: u.email,
        phone: u.phone || "+92 300 0000000",
        department: u.department || "Field Operations",
        designation: u.designation || u.role || "Technician",
        branchId: u.branchId,
        branchName: "Islamabad Core (F-10 HQ)",
        roleId: u.role || "role-staff",
        roleName: u.role || "Staff Member",
        status: u.isOnline ? "online" : "shift",
        tasksCompletedToday: 4,
        csatRating: 4.8,
        joinedDate: u.createdAt || "2026-01-15",
      })) as StaffUserRecord[];
    },
    async createStaff(payload: any) {
      const res = await apiClient.post("/users", payload);
      return res.data?.data || res.data;
    },
  },

  // 6. Governance
  governance: {
    async getSlaRules() {
      const res = await apiClient.get("/governance/sla-rules");
      return (res.data?.data || res.data || []) as SlaRule[];
    },
    async createSlaRule(payload: Partial<SlaRule>) {
      const res = await apiClient.post("/governance/sla-rules", payload);
      return res.data?.data || res.data;
    },
    async getCannedShortcuts() {
      const res = await apiClient.get("/governance/canned-shortcuts");
      const replies = res.data?.data || res.data || [];
      return replies.map((r: any) => ({
        id: r.id,
        shortcut: r.shortcut,
        title: r.title,
        body: r.content,
        category: r.category || "General",
        useCount: r.useCount || 0,
      })) as CannedTemplate[];
    },
    async createCannedShortcut(payload: any) {
      const res = await apiClient.post("/governance/canned-shortcuts", payload);
      return res.data?.data || res.data;
    },
    async getRoles() {
      const res = await apiClient.get("/rbac/roles");
      return (res.data?.data || res.data || []) as RbacRole[];
    },
    async getPermissions() {
      const res = await apiClient.get("/rbac/permissions");
      return res.data?.data || res.data || [];
    },
  },

  // 7. Live Chat
  chat: {
    async getConversations() {
      const res = await apiClient.get("/chat/conversations");
      return res.data?.data || res.data || [];
    },
    async createConversation(payload: {
      customerId?: string;
      phone?: string;
      fullName?: string;
      subject?: string;
      priority?: "low" | "normal" | "high" | "urgent";
      initialMessage?: string;
    }) {
      const res = await apiClient.post("/chat/conversations", payload, {
        validateStatus: (status) => status < 500,
      });
      if (res.status >= 400 || res.data?.success === false) {
        const errorMsg =
          res.data?.error?.message ||
          res.data?.message ||
          "No registered subscriber found with this mobile number.";
        return { error: errorMsg, notFound: res.status === 404 };
      }
      return res.data?.data || res.data;
    },
    async getMessages(conversationId: string) {
      const res = await apiClient.get(`/chat/conversations/${conversationId}/messages`);
      return res.data?.data || res.data || [];
    },
    async sendMessage(payload: { conversationId: string; content: string; senderType?: string; senderName?: string }) {
      const res = await apiClient.post("/chat/messages", payload);
      return res.data?.data || res.data;
    },
  },
};
