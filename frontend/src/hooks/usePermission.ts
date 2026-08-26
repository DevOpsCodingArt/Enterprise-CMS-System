"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import type { UserRole } from "@/types/auth.types";

/**
 * Custom hook for programmatic RBAC permission checks in event handlers,
 * table row actions, dropdown menus, and business logic.
 * 
 * Example:
 * ```tsx
 * const { can, hasBranchAccess, isCompanyOwner } = usePermission();
 * 
 * const handleReboot = () => {
 *   if (!can("noc.reboot_onu")) {
 *     toast.error("You do not have permission to reboot optical hardware.");
 *     return;
 *   }
 *   rebootHardware();
 * };
 * ```
 */
export function usePermission() {
  const { user, can, canAll, canAny, hasBranchAccess } = useAuthStore();

  const isPlatformOwner = user?.role === "platform_owner" || user?.permissions.includes("*") || false;
  const isCompanyOwner = user?.role === "company_owner" || false;
  const userRole: UserRole | undefined = user?.role;
  const userPermissions: string[] = user?.permissions || [];

  return {
    user,
    userRole,
    userPermissions,
    isPlatformOwner,
    isCompanyOwner,
    can,
    canAll,
    canAny,
    hasBranchAccess,
  };
}
