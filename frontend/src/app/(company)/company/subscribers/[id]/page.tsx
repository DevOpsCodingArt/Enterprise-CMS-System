"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { telecomService } from "@/services/telecom.service";
import type { SubscriberRecord } from "@/types/telecom-entities.types";
import { Customer360ProfileView } from "@/components/company/subscribers/crm/profile/Customer360ProfileView";

export default function SubscriberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const subscriberId = resolvedParams.id;

  const [subscriber, setSubscriber] = useState<SubscriberRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    telecomService.subscribers
      .getById(subscriberId)
      .then((data) => {
        if (data) {
          setSubscriber(data);
        } else {
          return telecomService.subscribers.list();
        }
      })
      .then((list) => {
        if (Array.isArray(list) && list.length > 0) {
          const found =
            list.find(
              (s) =>
                s.id === subscriberId ||
                s.customerCode.toLowerCase() === subscriberId.toLowerCase()
            ) || list[0];
          setSubscriber(found);
        }
      })
      .catch((err) => {
        console.error("Error loading subscriber:", err);
      })
      .finally(() => setLoading(false));
  }, [subscriberId]);

  if (loading && !subscriber) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          Loading subscriber record...
        </div>
      </div>
    );
  }

  if (!subscriber) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3">
        <p className="text-muted-foreground">Subscriber not found</p>
        <button
          onClick={() => router.push("/company/subscribers")}
          className="text-xs text-primary underline"
        >
          Back to directory
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden flex flex-col">
      <Customer360ProfileView
        subscriber={subscriber}
        onClose={() => router.push("/company/subscribers")}
      />
    </div>
  );
}

