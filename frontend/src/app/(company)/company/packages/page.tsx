"use client";

import React from "react";
import { TariffPackagesView } from "@/components/company/subscribers/packages/TariffPackagesView";

export default function TariffPackagesPage() {
  return (
    <div className="h-full w-full overflow-hidden flex flex-col p-6">
      <TariffPackagesView />
    </div>
  );
}
