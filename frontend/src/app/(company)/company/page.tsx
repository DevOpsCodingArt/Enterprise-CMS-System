"use client";

import React from "react";
import { useTenantStore } from "@/stores/useTenantStore";
import { OperationsDeskView } from "@/components/company/OperationsDeskView";
import { SubscribersCrmView } from "@/components/company/SubscribersCrmView";
import { WorkforceHrView } from "@/components/company/WorkforceHrView";
import { GovernanceSettingsView } from "@/components/company/GovernanceSettingsView";

export default function CompanyDashboardPage() {
  const { activeCompanyTab } = useTenantStore();

  // 1. OPERATIONS DESK
  if (activeCompanyTab === "desk" || activeCompanyTab === "tickets" || activeCompanyTab === "connections") {
    return <OperationsDeskView initialSubTab={activeCompanyTab} />;
  }

  // 2. SUBSCRIBERS (CRM)
  if (activeCompanyTab === "customers" || activeCompanyTab === "packages") {
    return <SubscribersCrmView initialSubTab={activeCompanyTab} />;
  }

  // 3. WORKFORCE, HR & SHIFTS
  if (
    activeCompanyTab === "departments" ||
    activeCompanyTab === "staff" ||
    activeCompanyTab === "shifts" ||
    activeCompanyTab === "attendance" ||
    activeCompanyTab === "tasks"
  ) {
    return <WorkforceHrView initialSubTab={activeCompanyTab} />;
  }

  // 4. GOVERNANCE & SETTINGS
  if (
    activeCompanyTab === "roles" ||
    activeCompanyTab === "canned" ||
    activeCompanyTab === "sla" ||
    activeCompanyTab === "profile"
  ) {
    return <GovernanceSettingsView initialSubTab={activeCompanyTab} />;
  }

  // 5. FALLBACK
  return <OperationsDeskView initialSubTab="desk" />;
}
