"use client";

import React, { useSyncExternalStore } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

const emptySubscribe = () => () => {};

export interface PermissionGuardProps {
  /**
   * Single permission slug (e.g. "tickets.assign_van") or multiple slugs.
   */
  permission?: string;
  permissions?: string[];
  /**
   * If true, user must have ALL listed permissions; if false (default), ANY permission suffices.
   */
  requireAll?: boolean;
  /**
   * Optional branchId to check if the current staff member has access to this branch context.
   */
  branchId?: string;
  /**
   * Protected UI elements to render if authorized.
   */
  children: React.ReactNode;
  /**
   * Optional fallback UI to render if unauthorized (e.g. Disabled button, Read-only badge, or null).
   */
  fallback?: React.ReactNode;
}

/**
 * Declarative component for guarding intra-page buttons, forms, actions, and tabs.
 * 
 * Examples:
 * ```tsx
 * <PermissionGuard permission="tickets.create">
 *   <Button onClick={openModal}>+ Create Ticket</Button>
 * </PermissionGuard>
 * 
 * <PermissionGuard 
 *   permission="noc.reboot_onu"
 *   fallback={<Badge variant="outline">Read Only</Badge>}
 * >
 *   <Button variant="destructive">Reboot ONU Port</Button>
 * </PermissionGuard>
 * ```
 */
export function PermissionGuard({
  permission,
  permissions = [],
  requireAll = false,
  branchId,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const { can, canAll, canAny, hasBranchAccess } = useAuthStore();

  // During SSR or initial hydration, render children or fallback safely
  if (!isMounted) {
    return <>{children}</>;
  }

  // 1. Check branch-level scope if branchId is specified
  if (branchId && !hasBranchAccess(branchId)) {
    return <>{fallback}</>;
  }

  // 2. Aggregate permission requirements
  const targetPermissions: string[] = [];
  if (permission) targetPermissions.push(permission);
  if (permissions.length > 0) targetPermissions.push(...permissions);

  // If no permissions specified, allow access
  if (targetPermissions.length === 0) {
    return <>{children}</>;
  }

  // 3. Evaluate permissions
  const isAllowed = requireAll
    ? canAll(targetPermissions)
    : canAny(targetPermissions);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
