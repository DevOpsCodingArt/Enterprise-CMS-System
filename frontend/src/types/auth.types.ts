/**
 * Authentication and Role-Based Access Control (RBAC) Types.
 */

export type UserRole =
  | "platform_owner"
  | "company_owner"
  | "branch_manager"
  | "noc_engineer"
  | "helpdesk_agent"
  | "field_engineer"
  | "accounts_officer"
  | "customer";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  department?: "NOC" | "Helpdesk" | "Field Operations" | "Accounts" | "Management" | "Executive";
  branchId?: string;
  branchName?: string;
  companyId: string;
  avatarUrl?: string;
  permissions: string[];
  isOnline?: boolean;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
