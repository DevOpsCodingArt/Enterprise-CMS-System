/**
 * Centralized Route-to-Permission Mapping (Single Source of Truth)
 * 
 * Defines mandatory permission slugs for each protected route in the application.
 * Used by:
 * 1. Next.js Edge Middleware (Server-Side Route Interception & Redirects)
 * 2. Sidebar Navigation (Smart Auto-Pruning of unpermitted links)
 * 3. Client Guards & Hooks
 */

export interface RoutePermissionConfig {
  /** Route pathname or prefix (e.g., "/company/tickets") */
  path: string;
  /** Array of permission slugs required (at least one must match) */
  permissions: string[];
  /** Optional fallback redirect if permission check fails */
  redirectUrl?: string;
  /** If true, user must have ALL listed permissions; if false, ANY permission suffices */
  requireAll?: boolean;
}

export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  // Platform Owner Portal (Platform level super-admin)
  "/platform": ["platform.*", "*"],

  // Company Operations Portal & Sub-Modules
  "/company": ["chat.view", "tickets.view", "noc.view", "branch.view", "*"],
  "/company/desk": ["chat.view", "*"],
  "/company/tickets": ["tickets.view", "*"],
  "/company/noc": ["noc.view", "noc.view_olt", "*"],
  "/company/branches": ["branch.view", "*"],
  "/company/staff": ["user.view", "*"],
  "/company/roles": ["user.manage_permissions", "*"],
  "/company/settings": ["settings.company_profile", "*"],
  "/company/reports": ["reports.view_chat_reports", "*"],
  "/company/inventory": ["inventory.view", "*"],
  "/company/customers": ["customer.view", "*"],

  // Customer Self-Service Portal Simulator
  "/portal": ["customer.self_service", "customer.chat", "*"],
};

/**
 * Helper to match the most specific route permission config for a given pathname.
 * Handles subpaths (e.g. /company/tickets/TK-8842 matches /company/tickets).
 */
export function getRequiredPermissionsForRoute(pathname: string): string[] | null {
  // Direct match
  if (ROUTE_PERMISSIONS[pathname]) {
    return ROUTE_PERMISSIONS[pathname];
  }

  // Prefix match (longest matching prefix first)
  const sortedPrefixes = Object.keys(ROUTE_PERMISSIONS).sort(
    (a, b) => b.length - a.length
  );

  for (const prefix of sortedPrefixes) {
    if (pathname.startsWith(prefix) && prefix !== "/") {
      return ROUTE_PERMISSIONS[prefix];
    }
  }

  return null;
}
