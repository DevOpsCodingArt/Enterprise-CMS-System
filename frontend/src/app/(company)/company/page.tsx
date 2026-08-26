"use client";

import React, { useState } from "react";
import { useTenantStore } from "@/stores/useTenantStore";
import { ExecutiveDashboardView } from "@/components/company/ExecutiveDashboardView";
import { BranchGovernanceView } from "@/components/company/BranchGovernanceView";
import { StaffWorkforceView } from "@/components/company/StaffWorkforceView";
import { RBACBuilderView } from "@/components/company/RBACBuilderView";
import { FinancialLedgerView } from "@/components/company/FinancialLedgerView";
import { NetworkFleetView } from "@/components/company/NetworkFleetView";
import { AuditStreamView } from "@/components/company/AuditStreamView";

export default function CompanyDashboardPage() {
  const {
    activeCompanyTab: activeTab,
    setActiveCompanyTab: setActiveTab,
  } = useTenantStore();

  return (
    <div className="space-y-6">
      {/* 1. Dynamic Tab Router */}
      {(!activeTab || activeTab === "overview") && (
        <ExecutiveDashboardView onNavigateTab={setActiveTab} />
      )}

      {activeTab === "branches" && <BranchGovernanceView />}

      {activeTab === "staff" && <StaffWorkforceView />}

      {activeTab === "rbac" && <RBACBuilderView />}

      {activeTab === "finance" && <FinancialLedgerView />}

      {activeTab === "network" && <NetworkFleetView />}

      {activeTab === "audit" && <AuditStreamView />}
    </div>
  );
}
