/**
 * Centralized Mock Database for Prime One Telecom OS
 * Aggregates domain data modules from src/mock/data/
 */

import { MOCK_TENANT_COMPANY, MOCK_BRANCHES, MOCK_COMPANY_PROFILE } from "./data/tenant.data";
import { MOCK_PACKAGES, MOCK_SUBSCRIBERS } from "./data/subscribers.data";
import { MOCK_TICKETS, MOCK_WORK_ORDERS, MOCK_SLA_RULES } from "./data/tickets.data";
import { MOCK_NEW_CONNECTIONS } from "./data/connections.data";
import {
  MOCK_DEPARTMENTS,
  MOCK_STAFF_DIRECTORY,
  MOCK_SHIFTS,
  MOCK_ATTENDANCE,
  MOCK_RBAC_ROLES,
  MOCK_CANNED_SHORTCUTS,
  MOCK_USERS,
} from "./data/staff.data";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "./data/chat.data";

// Re-export domain types
export type { TariffPackage, SubscriberRecord } from "./data/subscribers.data";
export type { TroubleTicket, WorkOrderTask, SlaRule } from "./data/tickets.data";
export type { NewConnectionLead } from "./data/connections.data";
export type {
  DepartmentRecord,
  StaffUserRecord,
  ShiftRoster,
  AttendanceRecord,
  RbacRole,
  CannedTemplate,
} from "./data/staff.data";

// Re-export mock data constants
export {
  MOCK_TENANT_COMPANY,
  MOCK_BRANCHES,
  MOCK_COMPANY_PROFILE,
  MOCK_PACKAGES,
  MOCK_SUBSCRIBERS,
  MOCK_TICKETS,
  MOCK_WORK_ORDERS,
  MOCK_SLA_RULES,
  MOCK_NEW_CONNECTIONS,
  MOCK_DEPARTMENTS,
  MOCK_STAFF_DIRECTORY,
  MOCK_SHIFTS,
  MOCK_ATTENDANCE,
  MOCK_RBAC_ROLES,
  MOCK_CANNED_SHORTCUTS,
  MOCK_USERS,
  MOCK_CONVERSATIONS,
  MOCK_MESSAGES,
};

// Central Mock Database Facade
export const mockDb = {
  tenantCompany: MOCK_TENANT_COMPANY,
  users: MOCK_USERS,
  conversations: MOCK_CONVERSATIONS,
  messages: MOCK_MESSAGES,
  tickets: MOCK_TICKETS,
  branches: MOCK_BRANCHES,
  packages: MOCK_PACKAGES,
  subscribers: MOCK_SUBSCRIBERS,
  newConnections: MOCK_NEW_CONNECTIONS,
  departments: MOCK_DEPARTMENTS,
  staff: MOCK_STAFF_DIRECTORY,
  shifts: MOCK_SHIFTS,
  attendance: MOCK_ATTENDANCE,
  workOrders: MOCK_WORK_ORDERS,
  roles: MOCK_RBAC_ROLES,
  cannedShortcuts: MOCK_CANNED_SHORTCUTS,
  slaRules: MOCK_SLA_RULES,
  companyProfile: MOCK_COMPANY_PROFILE,
};
