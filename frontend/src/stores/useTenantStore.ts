import { create } from "zustand";
import type { TenantCompany, BranchOffice } from "@/types/tenant.types";

const INITIAL_COMPANY: TenantCompany = {
  id: "comp-prime-01",
  name: "Prime Networks (Pvt) Ltd",
  slug: "prime-networks",
  subdomain: "primenetworks",
  status: "active",
  totalBranches: 3,
  totalSubscribers: 3420,
  features: {
    smartOlt: true,
    mikrotikRadius: true,
    zlUltraSync: true,
    omniChat: true,
    aiDiagnostics: true,
  },
  themeTokens: {
    primaryHex: "#2563EB",
    secondaryHex: "#1E293B",
  },
};

const INITIAL_BRANCHES: BranchOffice[] = [
  {
    id: "br-isb-01",
    companyId: "comp-prime-01",
    code: "ISB-F10",
    name: "Islamabad Core (F-10 HQ)",
    city: "Islamabad",
    address: "Plot 42, Sector F-10 Markaz, Islamabad",
    managerName: "Eng. Moiz Ahmad",
    managerPhone: "+92 300 8594021",
    totalStaff: 14,
    totalEngineers: 8,
    openTickets: 3,
    slaCompliancePercent: 99.8,
    subnets: ["10.240.10.0/24", "103.14.22.0/24"],
    isActive: true,
  },
  {
    id: "br-lhr-01",
    companyId: "comp-prime-01",
    code: "LHR-GLB",
    name: "Lahore Gulberg III",
    city: "Lahore",
    address: "Plaza 18, Main Boulevard, Gulberg III, Lahore",
    managerName: "Khurram Shahzad",
    managerPhone: "+92 321 5552202",
    totalStaff: 12,
    totalEngineers: 10,
    openTickets: 7,
    slaCompliancePercent: 99.2,
    subnets: ["10.240.20.0/24", "103.14.23.0/24"],
    isActive: true,
  },
];

interface TenantState {
  activeCompany: TenantCompany | null;
  branches: BranchOffice[];
  selectedBranchId: string | null;
  activeCompanyTab: string;
  setActiveCompany: (company: TenantCompany) => void;
  setBranches: (branches: BranchOffice[]) => void;
  selectBranch: (branchId: string | null) => void;
  setActiveCompanyTab: (tab: string) => void;
}

export const useTenantStore = create<TenantState>((set) => ({
  activeCompany: INITIAL_COMPANY,
  branches: INITIAL_BRANCHES,
  selectedBranchId: null, // null means "All Branches"
  activeCompanyTab: "desk",

  setActiveCompany: (activeCompany) => set({ activeCompany }),
  setBranches: (branches) => set({ branches }),
  selectBranch: (selectedBranchId) => set({ selectedBranchId }),
  setActiveCompanyTab: (activeCompanyTab) => set({ activeCompanyTab }),
}));
