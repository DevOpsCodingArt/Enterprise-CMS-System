"use client";

import React from "react";
import { RbacRolesTab } from "./governance/RbacRolesTab";
import { CannedShortcutsTab } from "./governance/CannedShortcutsTab";
import { SlaRulesTab } from "./governance/SlaRulesTab";
import { CompanyProfileTab } from "./governance/CompanyProfileTab";

export function GovernanceSettingsView({ initialSubTab = "roles" }: { initialSubTab?: string }) {
  const activeTab = initialSubTab;

  return (
    <div className="h-full w-full font-body overflow-hidden">
      {/* 1. RBAC RIGHTS MATRIX */}
      {activeTab === "roles" && <RbacRolesTab />}

      {/* 2. CANNED SHORTCUTS */}
      {activeTab === "canned" && <CannedShortcutsTab />}

      {/* 3. SLA RULES */}
      {activeTab === "sla" && <SlaRulesTab />}

      {/* 4. COMPANY PROFILE & INTEGRATIONS */}
      {activeTab === "profile" && <CompanyProfileTab />}
    </div>
  );
}
