import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, UserRole } from "@/types/auth.types";
import type { TenantCompany } from "@/types/tenant.types";
import { mockDb } from "@/mock/db";

interface AuthState {
  user: UserProfile | null;
  company: TenantCompany | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: UserProfile, company: TenantCompany, accessToken: string, refreshToken?: string) => void;
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  can: (permissionSlug: string) => boolean;
  canAll: (permissionSlugs: string[]) => boolean;
  canAny: (permissionSlugs: string[]) => boolean;
  hasBranchAccess: (branchId?: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Consumes pre-seeded user & company from mockDb for clean replacement with backend
      user: mockDb.users.company_owner,
      company: mockDb.tenantCompany,
      accessToken: "mock-jwt-token-prime-one",
      refreshToken: "mock-jwt-refresh-token",
      isAuthenticated: true,
      isLoading: false,

      setAuth: (user, company, accessToken, refreshToken) =>
        set({
          user,
          company,
          accessToken,
          refreshToken: refreshToken || null,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          company: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      switchDemoRole: (role) => {
        const demoUser = mockDb.users[role];
        set({
          user: demoUser,
          isAuthenticated: true,
        });
      },

      can: (permissionSlug) => {
        const { user } = get();
        if (!user) return false;
        if (user.permissions.includes("*")) return true;
        if (permissionSlug === "*") return user.permissions.includes("*");
        if (user.permissions.includes(permissionSlug)) return true;

        // Module wildcard checking for dot notation (e.g. "chat.*" covers "chat.view")
        const dotDomain = permissionSlug.split(".")[0];
        if (user.permissions.includes(`${dotDomain}.*`)) return true;

        // Backward compatibility for colon notation (e.g. "chat:*" covers "chat:reply")
        const colonDomain = permissionSlug.split(":")[0];
        if (user.permissions.includes(`${colonDomain}:*`)) return true;

        return false;
      },

      canAll: (permissionSlugs) => {
        const { can } = get();
        return permissionSlugs.every((slug) => can(slug));
      },

      canAny: (permissionSlugs) => {
        const { can } = get();
        return permissionSlugs.some((slug) => can(slug));
      },

      hasBranchAccess: (branchId) => {
        const { user } = get();
        if (!user) return false;
        // Platform owner, Company owner, or global staff with wildcard / no branch restriction
        if (user.role === "platform_owner" || user.role === "company_owner") return true;
        if (user.permissions.includes("*") || user.permissions.includes("branch.*")) return true;
        if (!branchId || branchId === "all") return true;
        if (!user.branchId) return true; // Company-wide staff
        return user.branchId === branchId;
      },
    }),
    {
      name: "prime-one-auth-storage",
      partialize: (state) => ({
        user: state.user,
        company: state.company,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
