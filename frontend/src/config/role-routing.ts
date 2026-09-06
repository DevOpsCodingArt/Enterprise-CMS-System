/**
 * Central Role-Based Routing & Redirection Configuration
 * Single source of truth for role-to-route mappings across the 3 core UIs:
 * 1. Platform Owner Portal (/platform)
 * 2. Company Operations Portal (/company/*)
 * 3. Customer Self-Care Portal (/portal)
 */

export type PortalTier = "platform" | "company" | "customer";

export interface DemoUserCredential {
  email: string;
  password: string;
  role: string;
  name: string;
  portal: PortalTier;
  homeRoute: string;
  badgeLabel: string;
  badgeVariant: "success" | "warning" | "destructive" | "info" | "secondary";
  description: string;
}

export const ROLE_HOME_ROUTES: Record<string, string> = {
  // UI #1: Platform Owner / SaaS Super-Admin
  PLATFORM_OWNER: "/platform",
  platform_owner: "/platform",
  SUPER_ADMIN: "/platform",
  super_admin: "/platform",

  // UI #2: Company Operations & Executive
  COMPANY_OWNER: "/company/subscribers",
  company_owner: "/company/subscribers",
  EXECUTIVE: "/company/subscribers",
  executive: "/company/subscribers",

  // UI #2: Helpdesk & Customer Support (CSR)
  CSR: "/company/desk",
  csr: "/company/desk",
  CUSTOMER_SUPPORT: "/company/desk",
  customer_support: "/company/desk",
  HELPDESK_AGENT: "/company/desk",
  helpdesk_agent: "/company/desk",

  // UI #2: Network Operations Center (NOC) & Field Engineering
  NOC_ENGINEER: "/company/tickets",
  noc_engineer: "/company/tickets",
  NETWORK_ENGINEER: "/company/tickets",
  network_engineer: "/company/tickets",
  TECHNICIAN: "/company/tickets",
  technician: "/company/tickets",
  FIELD_ENGINEER: "/company/tickets",
  field_engineer: "/company/tickets",
  SPLICER: "/company/tickets",
  splicer: "/company/tickets",

  // UI #2: Accounts, Billing & Tariff
  FINANCE_OFFICER: "/company/packages",
  finance_officer: "/company/packages",
  ACCOUNTANT: "/company/packages",
  accountant: "/company/packages",

  // UI #2: Branch Management & HR
  BRANCH_MANAGER: "/company/staff",
  branch_manager: "/company/staff",
  HR_OFFICER: "/company/staff",
  hr_officer: "/company/staff",

  // UI #3: End Subscriber / Customer Self-Care
  CUSTOMER: "/portal",
  customer: "/portal",
  SUBSCRIBER: "/portal",
  subscriber: "/portal",
};

export const DEMO_USERS: DemoUserCredential[] = [
  {
    email: "admin@primenetworks.pk",
    password: "Password123!",
    role: "company_owner",
    name: "Tariq Mehmood",
    portal: "company",
    homeRoute: "/company/subscribers",
    badgeLabel: "Company Owner (CEO)",
    badgeVariant: "success",
    description: "Full ISP control, 3.4k subscriber CRM & revenue management",
  },
  {
    email: "supervisor@primenetworks.pk",
    password: "Password123!",
    role: "csr",
    name: "Khurram Shahzad",
    portal: "company",
    homeRoute: "/company/desk",
    badgeLabel: "Support Supervisor",
    badgeVariant: "info",
    description: "Support operations oversight, queue management & ticket escalations",
  },
  {
    email: "agent@primenetworks.pk",
    password: "Password123!",
    role: "csr",
    name: "Ali Raza",
    portal: "company",
    homeRoute: "/company/desk",
    badgeLabel: "Helpdesk Senior CSR",
    badgeVariant: "info",
    description: "Live chat queue, subscriber inquiries & ticket creation",
  },
  {
    email: "field@primenetworks.pk",
    password: "Password123!",
    role: "field_engineer",
    name: "Usman Splicer",
    portal: "company",
    homeRoute: "/company/tickets",
    badgeLabel: "Senior Fiber Splicer",
    badgeVariant: "secondary",
    description: "OTDR break measurements, PON shifting & fiber splicing work orders",
  },
  {
    email: "ali.khan@gmail.com",
    password: "Password123!",
    role: "customer",
    name: "Muhammad Ali Khan",
    portal: "customer",
    homeRoute: "/portal",
    badgeLabel: "End Subscriber",
    badgeVariant: "secondary",
    description: "Broadband self-care portal, optical light diagnostics & tickets",
  },
  {
    email: "superadmin@primeone.io",
    password: "Password123!",
    role: "platform_owner",
    name: "Prime One Super Admin",
    portal: "platform",
    homeRoute: "/platform",
    badgeLabel: "Platform Super-Admin",
    badgeVariant: "destructive",
    description: "Global multi-tenant ISP fleet provisioning & platform governance",
  },
];

/**
 * Returns the designated landing route for any user role.
 */
export function getRoleHomeRoute(role?: string): string {
  if (!role) return "/company/subscribers";
  return ROLE_HOME_ROUTES[role] || "/company/subscribers";
}

/**
 * Returns the portal tier (platform | company | customer) for a given role.
 */
export function getRolePortal(role?: string): PortalTier {
  if (!role) return "company";
  const normalized = role.toLowerCase();
  if (normalized.includes("platform") || normalized.includes("super")) return "platform";
  if (normalized.includes("customer") || normalized.includes("subscriber")) return "customer";
  return "company";
}

/**
 * Returns a human-friendly display label for a role.
 */
export function getRoleDisplayName(role?: string): string {
  if (!role) return "Staff Member";
  const user = DEMO_USERS.find((u) => u.role.toLowerCase() === role.toLowerCase());
  if (user) return user.badgeLabel;
  return role
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
