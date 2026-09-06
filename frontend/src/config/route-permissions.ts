/**
 * Central Route Permission Configuration (Single Source of Truth)
 * Maps Prime One application routes to their required RBAC permissions.
 */

export interface RouteConfig {
  path: string;
  label: string;
  requiredPermissions: string[];
  module: string;
}

export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  // 0. SaaS Platform Owner Master Suite
  "/platform": ["platform.admin"],
  "/platform/overview": ["platform.admin"],
  "/platform/tenants": ["platform.manage_tenants"],
  "/platform/billing": ["platform.view_mrr"],
  "/platform/infrastructure": ["platform.view_nodes"],
  "/platform/telemetry": ["platform.view_nodes"],
  "/platform/audit": ["platform.view_logs"],
  "/platform/settings": ["platform.admin"],

  // 1. Executive Suite (Company Owner / Top Management)
  "/company": ["company.executive_view"],
  "/company/overview": ["company.executive_view"],
  "/company/branches": ["branch.view", "branch.view_all", "branch.manage"],
  "/company/staff": ["user.view", "staff.view_all", "staff.manage"],
  "/company/roles": ["user.manage_permissions", "roles.manage"],
  "/company/audit": ["audit.view_logs", "settings.view"],

  // 2. Accounts & Billing Workspace (Finance Officers)
  "/company/finance": ["billing.view", "billing.view_ledger", "payment.verify"],
  "/company/invoices": ["billing.view", "billing.view_invoices"],

  // 3. Helpdesk & Customer Support (CSRs)
  "/company/desk": ["chat.view"],
  "/company/tickets": ["ticket.view", "tickets.view"],
  "/company/connections": ["ticket.view", "tickets.view", "field.view_jobs"],
  "/company/subscribers": ["customer.view", "customers.view"],
  "/company/customers": ["customer.view", "customers.view"],
  "/company/packages": ["billing.view", "billing.manage_packages", "billing.view_ledger", "company.executive_view"],

  // 4. Field Engineering & Splicing (40 Technicians & Van Teams)
  "/company/field": ["field.view_jobs", "field.calibrate_line", "ticket.view"],
  "/company/inventory": ["inventory.view", "inventory.consume"],

  // 5. NOC & Optical Radar (Network Engineers)
  "/company/noc": ["noc.view_radar", "network.diagnostics", "olt.manage"],

  // 6. Branch Management (Branch Supervisors)
  "/company/branch-operations": ["branch.view", "branch.view_self", "branch.manage_roster"],
};

/**
 * Checks if a user holding a given set of permissions has access to a specific route.
 */
export function hasRouteAccess(routePath: string, userPermissions: string[]): boolean {
  if (
    userPermissions.includes("*") ||
    userPermissions.includes("*.*") ||
    userPermissions.includes("admin")
  ) {
    return true;
  }

  // 1. Check exact match first (highest precedence)
  let required = ROUTE_PERMISSIONS[routePath];

  // 2. If no exact match, find longest matching prefix (most specific route first)
  if (!required) {
    const sortedKeys = Object.keys(ROUTE_PERMISSIONS).sort((a, b) => b.length - a.length);
    const matchingKey = sortedKeys.find(
      (key) => routePath === key || routePath.startsWith(`${key}/`)
    );
    if (matchingKey) {
      required = ROUTE_PERMISSIONS[matchingKey];
    }
  }

  if (!required) {
    // Routes not explicitly in the map are open to authenticated staff
    return true;
  }
  return required.some((perm) => {
    if (userPermissions.includes(perm)) return true;
    const [domain] = perm.split(".");
    if (userPermissions.includes(`${domain}.*`)) return true;
    // Singular vs plural tolerance
    if (domain.endsWith("s") && userPermissions.includes(`${domain.slice(0, -1)}.*`)) return true;
    if (!domain.endsWith("s") && userPermissions.includes(`${domain}s.*`)) return true;
    return false;
  });
}
