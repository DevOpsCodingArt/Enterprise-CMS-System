"use client";

import React, { useState } from "react";
import { SubscriberPlanCard } from "@/components/customer/SubscriberPlanCard";
import { OpticalSignalTester } from "@/components/customer/OpticalSignalTester";
import { BillingInvoiceList } from "@/components/customer/BillingInvoiceList";
import { LiveSupportWidget } from "@/components/customer/LiveSupportWidget";
import { Plus, Ticket, HelpCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";

export default function CustomerPortalPage() {
  const toast = useToast();
  const [isComplaintModalOpen, setIsComplaintModalOpen] = useState(false);
  const [complaintCategory, setComplaintCategory] = useState("Optical / No Internet");
  const [complaintDesc, setComplaintDesc] = useState("");

  const handleLodgeComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      "Ticket Lodged",
      "Ticket #TK-8899 has been assigned to Islamabad HQ field engineers."
    );
    setIsComplaintModalOpen(false);
    setComplaintDesc("");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Quick Complaint Button */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
            Welcome back, Ahmed
          </h2>
          <p className="text-xs text-muted-foreground">
            Manage your fiber internet connection, verify optical line health, and access live support.
          </p>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setIsComplaintModalOpen(true)}
          className="gap-1.5 shadow-xs"
        >
          <Ticket className="h-3.5 w-3.5" />
          <span>Lodge Complaint / Trouble Ticket</span>
        </Button>
      </div>

      {/* 1. Subscriber Active Plan & Connection Telemetry */}
      <SubscriberPlanCard />

      {/* 2. Interactive Optical Signal Health Diagnostic Test */}
      <OpticalSignalTester />

      {/* 3. 2-Column Grid: Billing Receipts + Live Support Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <BillingInvoiceList />
        </div>

        <div className="lg:col-span-5">
          <LiveSupportWidget />
        </div>
      </div>

      {/* Complaint Modal Dialog */}
      <Dialog
        isOpen={isComplaintModalOpen}
        onClose={() => setIsComplaintModalOpen(false)}
      >
        <DialogHeader>
          <DialogTitle>Lodge Support Complaint</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLodgeComplaint}>
          <DialogContent className="space-y-4">
            <Input
              label="Complaint Category"
              value={complaintCategory}
              onChange={(e) => setComplaintCategory(e.target.value)}
              placeholder="e.g. Optical Power / Speed Drop / Billing"
              required
            />

            <Textarea
              label="Describe the Issue"
              placeholder="Please describe what is happening with your connection..."
              value={complaintDesc}
              onChange={(e) => setComplaintDesc(e.target.value)}
              required
            />
          </DialogContent>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsComplaintModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit Complaint
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
