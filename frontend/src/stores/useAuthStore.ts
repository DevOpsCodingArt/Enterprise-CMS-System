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
        if (user.permissions.includes(permissionSlug)) return true;

        // Prefix wildcard checking (e.g. "chat:*" covers "chat:reply")
        const [domain] = permissionSlug.split(":");
        if (user.permissions.includes(`${domain}:*`)) return true;

        return false;
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
