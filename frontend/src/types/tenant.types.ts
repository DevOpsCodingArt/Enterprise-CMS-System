/**
 * Multi-Tenant ISP Company and Branch Types.
 */

export interface TenantCompany {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  subdomain?: string;
  status: "active" | "suspended" | "trial";
  totalBranches: number;
  totalSubscribers: number;
  features: {
    smartOlt: boolean;
    mikrotikRadius: boolean;
    zlUltraSync: boolean;
    omniChat: boolean;
    aiDiagnostics: boolean;
  };
  themeTokens?: {
    primaryHex?: string;
    secondaryHex?: string;
  };
}

export interface BranchOffice {
  id: string;
  companyId: string;
  code: string;
  name: string;
  city: string;
  address: string;
  managerName: string;
  managerPhone: string;
  totalStaff: number;
  totalEngineers: number;
  openTickets: number;
  slaCompliancePercent: number;
  subnets: string[];
  isActive: boolean;
}
