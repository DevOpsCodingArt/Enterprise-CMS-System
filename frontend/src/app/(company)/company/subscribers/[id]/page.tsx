"use client";

import React, { use } from "react";
import { useRouter, useParams } from "next/navigation";
import { mockDb, SubscriberRecord } from "@/mock/db";
import { Customer360ProfileView } from "@/components/company/subscribers/crm/profile/Customer360ProfileView";

export default function SubscriberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const subscriberId = resolvedParams.id;

  const subscriber =
    mockDb.subscribers.find(
      (s) => s.id === subscriberId || s.customerCode.toLowerCase() === subscriberId.toLowerCase()
    ) || mockDb.subscribers[0];

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <Customer360ProfileView
        subscriber={subscriber}
        onClose={() => router.push("/company/subscribers")}
      />
    </div>
  );
}
