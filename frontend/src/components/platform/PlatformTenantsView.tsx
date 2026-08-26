"use client";

import React, { useState } from "react";
import { TenantProvisioningTable } from "./TenantProvisioningTable";
import { TenantProvisioningModal } from "./TenantProvisioningModal";

export function PlatformTenantsView() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <TenantProvisioningTable onOpenProvisionModal={() => setIsModalOpen(true)} />
      <TenantProvisioningModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
