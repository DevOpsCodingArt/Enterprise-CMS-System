"use client";

import React from "react";
import { OperationsDeskView } from "@/components/company/OperationsDeskView";

export default function ConnectionsPage() {
  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <OperationsDeskView initialSubTab="connections" />
    </div>
  );
}
