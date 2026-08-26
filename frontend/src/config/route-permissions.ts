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
  // 1. Executive Suite (Company Owner / Top Management)
  "/company": ["company.executive_view"],
  "/company/overview": ["company.executive_view"],
  "/company/branches": ["branch.view_all", "branch.manage"],
  "/company/staff": ["staff.view_all", "staff.manage"],
  "/company/roles": ["roles.manage"],
  "/company/audit": ["audit.view_logs"],

  // 2. Accounts & Billing Workspace (Finance Officers)
  "/company/finance": ["billing.view_ledger", "payment.verify"],
  "/company/invoices": ["billing.view_invoices"],

  // 3. Helpdesk & Customer Support (CSRs)
  "/company/desk": ["chat.view"],
  "/company/tickets": ["tickets.view"],
  "/company/customers": ["customers.view"],

  // 4. Field Engineering & Splicing (40 Technicians & Van Teams)
  "/company/field": ["field.view_jobs", "field.calibrate_line"],
  "/company/inventory": ["inventory.view", "inventory.consume"],

  // 5. NOC & Optical Radar (Network Engineers)
  "/company/noc": ["noc.view_radar", "olt.manage"],

  // 6. Branch Management (Branch Supervisors)
  "/company/branch-operations": ["branch.view_self", "branch.manage_roster"],
};

/**
 * Checks if a user holding a given set of permissions has access to a specific route.
 */
export function hasRouteAccess(routePath: string, userPermissions: string[]): boolean {
  if (userPermissions.includes("*.*") || userPermissions.includes("admin")) {
    return true;
  }

  // Find exact or closest prefix match
  const matchingKey = Object.keys(ROUTE_PERMISSIONS).find(
    (key) => routePath === key || routePath.startsWith(`${key}/`)
  );

  if (!matchingKey) {
    // Routes not explicitly in the map are public or open to authenticated staff
    return true;
  }

  const required = ROUTE_PERMISSIONS[matchingKey];
  return required.some((perm) => userPermissions.includes(perm));
}
