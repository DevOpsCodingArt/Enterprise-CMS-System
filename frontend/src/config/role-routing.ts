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
    email: "owner@primenetworks.pk",
    password: "password123",
    role: "company_owner",
    name: "Eng. Moiz Ahmad",
    portal: "company",
    homeRoute: "/company/subscribers",
    badgeLabel: "Company Owner (CEO)",
    badgeVariant: "success",
    description: "Full ISP control, 3.4k subscriber CRM & revenue management",
  },
  {
    email: "csr@primenetworks.pk",
    password: "password123",
    role: "csr",
    name: "Fatima Noor",
    portal: "company",
    homeRoute: "/company/desk",
    badgeLabel: "Customer Support (CSR)",
    badgeVariant: "info",
    description: "WhatsApp/Telegram live chat queue & subscriber tickets",
  },
  {
    email: "noc@primenetworks.pk",
    password: "password123",
    role: "noc_engineer",
    name: "Farhan NOC",
    portal: "company",
    homeRoute: "/company/tickets",
    badgeLabel: "NOC Lead Engineer",
    badgeVariant: "warning",
    description: "Optical telemetry alarms, feeder break dispatch & SmartOLT",
  },
  {
    email: "tech@primenetworks.pk",
    password: "password123",
    role: "technician",
    name: "Usman Ali",
    portal: "company",
    homeRoute: "/company/tickets",
    badgeLabel: "Field Splicer / Tech",
    badgeVariant: "secondary",
    description: "OTDR splicing work orders, mobile dispatch & Van #04",
  },
  {
    email: "finance@primenetworks.pk",
    password: "password123",
    role: "finance_officer",
    name: "Zainab Accounting",
    portal: "company",
    homeRoute: "/company/packages",
    badgeLabel: "Finance & Accounts",
    badgeVariant: "info",
    description: "Tariff plans, billing ledgers & cash recovery pipelines",
  },
  {
    email: "hr@primenetworks.pk",
    password: "password123",
    role: "branch_manager",
    name: "Bilal HR Supervisor",
    portal: "company",
    homeRoute: "/company/staff",
    badgeLabel: "Branch & HR Manager",
    badgeVariant: "secondary",
    description: "24/7 NOC shift rosters, biometric attendance & tasks",
  },
  {
    email: "customer@primenetworks.pk",
    password: "password123",
    role: "customer",
    name: "Ahmed Malik",
    portal: "customer",
    homeRoute: "/portal",
    badgeLabel: "End Subscriber",
    badgeVariant: "secondary",
    description: "Customer self-care, optical light test & invoice payments",
  },
  {
    email: "admin@primeone.io",
    password: "password123",
    role: "platform_owner",
    name: "SaaS Super Admin",
    portal: "platform",
    homeRoute: "/platform",
    badgeLabel: "Platform Super-Admin",
    badgeVariant: "destructive",
    description: "Global multi-tenant ISP fleet provisioning & SaaS MRR",
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
