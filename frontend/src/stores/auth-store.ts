import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, AuthTokens } from '@/types/auth.types';

interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  activeBranchId: string | null;

  // Actions
  setAuth: (user: AuthUser, tokens: AuthTokens) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  setActiveBranch: (branchId: string | null) => void;
  logout: () => void;
  hasPermission: (permissionSlug: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: {
        id: 'usr_f10_lead_01',
        companyId: 'cmp_prime_networks_01',
        branchId: 'br_isb_f10',
        email: 'noc.lead@primenetworks.pk',
        phone: '+92 300 1234567',
        username: 'moiz_noc',
        fullName: 'Eng. Moiz Ahmad',
        displayName: 'Moiz (NOC Lead)',
        avatarUrl: null,
        userType: 'staff',
        department: 'noc',
        designation: 'NOC Lead Engineer',
        isActive: true,
        isOnline: true,
        languagePreference: 'en',
        permissions: [
          'chat.view',
          'chat.reply',
          'chat.transfer',
          'chat.close',
          'chat.private_notes',
          'customers.view',
          'customers.create',
          'customers.edit',
          'tickets.view',
          'tickets.create',
          'tickets.assign',
          'users.view',
          'users.create',
          'reports.view',
        ],
        company: {
          id: 'cmp_prime_networks_01',
          name: 'Prime Networks (Pvt) Ltd',
          slug: 'prime-networks',
          logoUrl: '/prime-logo.png',
          primaryColor: '#0047FF',
          secondaryColor: '#00FFAA',
        },
        branch: {
          id: 'br_isb_f10',
          name: 'Islamabad F-10 Main Hub',
          code: 'ISB-F10',
        },
      },
      tokens: {
        accessToken: 'mock_jwt_access_token_prime_one_v1',
        refreshToken: 'mock_jwt_refresh_token_prime_one_v1',
      },
      isAuthenticated: true,
      activeBranchId: 'br_isb_f10',

      setAuth: (user, tokens) =>
        set({
          user,
          tokens,
          isAuthenticated: true,
          activeBranchId: user.branchId || null,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      setActiveBranch: (branchId) => set({ activeBranchId: branchId }),

      logout: () =>
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          activeBranchId: null,
        }),

      hasPermission: (slug) => {
        const { user } = get();
        if (!user) return false;
        if (user.userType === 'platform_owner' || user.userType === 'company_owner') {
          return true;
        }
        return user.permissions?.includes(slug) || false;
      },
    }),
    {
      name: 'prime_one_auth',
    }
  )
);
