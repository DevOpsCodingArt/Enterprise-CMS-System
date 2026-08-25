export type UserType = 'platform_owner' | 'company_owner' | 'staff';
export type LanguagePreference = 'en';

export interface AuthUser {
  id: string;
  companyId: string;
  branchId?: string | null;
  email: string;
  phone?: string | null;
  username: string;
  fullName: string;
  displayName?: string | null;
  avatarUrl?: string | null;
  userType: UserType;
  department: string;
  designation: string;
  isActive: boolean;
  isOnline: boolean;
  lastSeenAt?: string | null;
  lastLoginAt?: string | null;
  languagePreference: LanguagePreference;
  permissions: string[];
  company?: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string | null;
    primaryColor?: string | null;
    secondaryColor?: string | null;
  };
  branch?: {
    id: string;
    name: string;
    code: string;
  } | null;
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  password?: string;
  otpCode?: string;
  companySlug?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface LoginResponseData {
  user: AuthUser;
  tokens: AuthTokens;
}
