"use client";

import React, { use } from "react";
import { GovernanceSettingsView } from "@/components/company/GovernanceSettingsView";

export default function GovernanceRolesPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const resolvedSearchParams = searchParams ? use(searchParams) : undefined;
  const currentTab = resolvedSearchParams?.tab || "roles";

  return (
    <div className="h-full w-full overflow-hidden flex flex-col p-6">
      <GovernanceSettingsView initialSubTab={currentTab} />
    </div>
  );
}
