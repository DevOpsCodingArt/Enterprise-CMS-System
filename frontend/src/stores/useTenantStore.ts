import { create } from "zustand";
import type { TenantCompany, BranchOffice } from "@/types/tenant.types";
import { mockDb } from "@/mock/db";

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
  activeCompany: mockDb.tenantCompany,
  branches: mockDb.branches,
  selectedBranchId: null, // null means "All Branches"
  activeCompanyTab: "desk",

  setActiveCompany: (activeCompany) => set({ activeCompany }),
  setBranches: (branches) => set({ branches }),
  selectBranch: (selectedBranchId) => set({ selectedBranchId }),
  setActiveCompanyTab: (activeCompanyTab) => set({ activeCompanyTab }),
}));
