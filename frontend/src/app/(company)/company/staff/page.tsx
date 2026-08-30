"use client";

import React, { use } from "react";
import { useSearchParams } from "next/navigation";
import { WorkforceHrView } from "@/components/company/WorkforceHrView";

export default function WorkforceStaffPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const resolvedSearchParams = searchParams ? use(searchParams) : undefined;
  const currentTab = resolvedSearchParams?.tab || "staff";

  return (
    <div className="h-full w-full overflow-hidden flex flex-col p-6">
      <WorkforceHrView initialSubTab={currentTab} />
    </div>
  );
}
