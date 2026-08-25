import { mockTenants, MockTenant } from './tenants.mock';
import { mockSaaSTiers, mockSaaSInvoices, MockSaaSTier, MockSaaSInvoice } from './subscriptions.mock';
import { mockSystemMetrics, MockSystemMetrics } from './system.mock';
import { mockAuditLogs, MockAuditLog } from './audit.mock';
import { mockBranches, MockBranch } from './branches.mock';
import { mockStaffUsers, MockStaffUser } from './staff.mock';
import { mockCustomers } from './customers.mock';
import { mockDeskConversations, mockDeskMessages, mockCustomer360Data } from './desk.mock';
import { mockRoles, mockPermissionMatrix, MockRole, PermissionMatrixRow } from './roles.mock';
import { mockSupervisorAgents, MockSupervisorAgent } from './supervisor.mock';
import { mockOperationalReports, MockOperationalReports } from './reports.mock';
import { mockQuickReplies, mockWorkingHours, MockQuickReply, MockWorkingDay } from './settings.mock';
import {
  mockCustomerPortalSubscriber,
  mockCustomerInvoices,
  mockCustomerTickets,
  mockCustomerChatMessages,
  mockPaymentGateways,
  CustomerInvoice,
  CustomerTicket,
  CustomerChatMessage,
  PaymentGatewayChannel,
} from './customer-portal.mock';
import { Customer, Customer360 } from '@/types/customer.types';
import { Conversation, Message } from '@/types/chat.types';

export * from './tenants.mock';
export * from './subscriptions.mock';
export * from './system.mock';
export * from './audit.mock';
export * from './branches.mock';
export * from './staff.mock';
export * from './customers.mock';
export * from './desk.mock';
export * from './roles.mock';
export * from './supervisor.mock';
export * from './reports.mock';
export * from './settings.mock';
export * from './customer-portal.mock';

export const mockDb = {
  // Tenants
  getTenants: (): MockTenant[] => mockTenants,
  getTenantById: (id: string): MockTenant | undefined =>
    mockTenants.find((t) => t.id === id || t.slug === id),

  // Subscriptions
  getSaaSTiers: (): MockSaaSTier[] => mockSaaSTiers,
  getSaaSInvoices: (): MockSaaSInvoice[] => mockSaaSInvoices,

  // System
  getSystemMetrics: (): MockSystemMetrics => mockSystemMetrics,

  // Audit
  getAuditLogs: (): MockAuditLog[] => mockAuditLogs,

  // Branches
  getBranches: (): MockBranch[] => mockBranches,
  getBranchById: (id: string): MockBranch | undefined =>
    mockBranches.find((b) => b.id === id),

  // Staff
  getStaff: (): MockStaffUser[] => mockStaffUsers,
  getStaffById: (id: string): MockStaffUser | undefined =>
    mockStaffUsers.find((s) => s.id === id),

  // Customers
  getCustomers: (): Customer[] => mockCustomers,
  getCustomerById: (id: string): Customer | undefined =>
    mockCustomers.find((c) => c.id === id),

  // Customer Portal (Tier 3)
  getCustomerPortalSubscriber: (): Customer => mockCustomerPortalSubscriber,
  getCustomerInvoices: (): CustomerInvoice[] => mockCustomerInvoices,
  getCustomerTickets: (): CustomerTicket[] => mockCustomerTickets,
  getCustomerChatMessages: (): CustomerChatMessage[] => mockCustomerChatMessages,
  getPaymentGateways: (): PaymentGatewayChannel[] => mockPaymentGateways,

  // Live Prime Desk
  getDeskConversations: (): Conversation[] => mockDeskConversations,
  getDeskMessages: (): Message[] => mockDeskMessages,
  getCustomer360: (): Customer360 => mockCustomer360Data,

  // Roles & RBAC Matrix
  getRoles: (): MockRole[] => mockRoles,
  getPermissionMatrix: (): Record<string, PermissionMatrixRow[]> => mockPermissionMatrix,

  // Supervisor HUD
  getSupervisorAgents: (): MockSupervisorAgent[] => mockSupervisorAgents,

  // Reports
  getOperationalReports: (): MockOperationalReports => mockOperationalReports,

  // Settings
  getQuickReplies: (): MockQuickReply[] => mockQuickReplies,
  getWorkingHours: (): MockWorkingDay[] => mockWorkingHours,
};
