"use client";

import React, { useState } from "react";
import {
  DollarSign,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Check,
  X,
  ExternalLink,
  FileText,
  ShieldCheck,
  Receipt,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

export interface PaymentQueueItem {
  id: string;
  customerName: string;
  pppoeUsername: string;
  branchName: string;
  amountPkr: number;
  method: "1Link 1Bill" | "JazzCash" | "EasyPaisa" | "Bank Transfer (HBL)" | "Cash Slip";
  transactionId: string;
  status: "VERIFIED" | "PENDING_VERIFICATION" | "REJECTED";
  submittedAt: string;
  verifiedBy?: string;
}

export function FinancialLedgerView() {
  const toast = useToast();

  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "verified">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProof, setSelectedProof] = useState<PaymentQueueItem | null>(null);

  const [payments, setPayments] = useState<PaymentQueueItem[]>([
    {
      id: "pay-01",
      customerName: "Ahmed Malik",
      pppoeUsername: "ahmed_malik_isb",
      branchName: "Islamabad Blue Area (HQ)",
      amountPkr: 3850,
      method: "JazzCash",
      transactionId: "TID-8849102",
      status: "PENDING_VERIFICATION",
      submittedAt: "10 mins ago",
    },
    {
      id: "pay-02",
      customerName: "TechSol Pvt Ltd (Corporate)",
      pppoeUsername: "corp_techsol_01",
      branchName: "Islamabad F-7",
      amountPkr: 240000,
      method: "1Link 1Bill",
      transactionId: "1BILL-998241",
      status: "VERIFIED",
      submittedAt: "45 mins ago",
      verifiedBy: "Bilal Hassan (Billing Lead)",
    },
    {
      id: "pay-03",
      customerName: "Zeeshan Khan",
      pppoeUsername: "zeeshan_lhr_50",
      branchName: "Lahore Gulberg III",
      amountPkr: 4500,
      method: "EasyPaisa",
      transactionId: "EP-7741029",
      status: "PENDING_VERIFICATION",
      submittedAt: "1 hour ago",
    },
  ]);

  const handleVerify = (id: string) => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "VERIFIED",
              verifiedBy: "Tariq Mehmood (Company Owner)",
            }
          : p
      )
    );
    setSelectedProof(null);
    toast.success("Payment Verified", "Subscriber account recharged and instant unblocking dispatched to MikroTik Radius.");
  };

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pppoeUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionId.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === "pending") return matchesSearch && p.status === "PENDING_VERIFICATION";
    if (filterStatus === "verified") return matchesSearch && p.status === "VERIFIED";
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
            1Link & Payment Verification Queue
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Automated 1Bill collections and manual payment slip verification for subscriber line recharges.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="warning" hasPulse className="font-mono text-xs">
            {payments.filter((p) => p.status === "PENDING_VERIFICATION").length} PENDING VERIFICATION
          </Badge>
        </div>
      </div>

      {/* 2. Search & Status Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by customer, TID, or PPPoE..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={filterStatus === "pending" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("pending")}
            className="text-xs rounded-lg gap-1.5 cursor-pointer"
          >
            <span>Pending Approvals</span>
            <Badge variant="warning" className="text-[10px] py-0 px-1 font-mono">
              {payments.filter((p) => p.status === "PENDING_VERIFICATION").length}
            </Badge>
          </Button>

          <Button
            variant={filterStatus === "verified" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("verified")}
            className="text-xs rounded-lg gap-1.5 cursor-pointer"
          >
            <span>Verified Transactions</span>
          </Button>

          <Button
            variant={filterStatus === "all" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilterStatus("all")}
            className="text-xs rounded-lg cursor-pointer"
          >
            <span>All Ledger</span>
          </Button>
        </div>
      </div>

      {/* 3. Verification Table */}
      <Card className="bg-card border-border shadow-xs">
        <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-heading font-bold">
            Live Payment Verification Roster
          </CardTitle>
          <span className="text-xs font-mono text-muted-foreground">
            ZL Ultra Billing Engine
          </span>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subscriber</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Transaction TID</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((pay) => (
                <TableRow key={pay.id} className="hover:bg-card-subtle/40 transition-colors">
                  <TableCell>
                    <div>
                      <span className="font-bold text-xs text-foreground block">
                        {pay.customerName}
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {pay.pppoeUsername} • {pay.branchName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono font-bold text-xs text-foreground">
                    PKR {pay.amountPkr.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {pay.method}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-primary font-bold">
                    {pay.transactionId}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {pay.submittedAt}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={pay.status === "VERIFIED" ? "success" : "warning"}
                      hasPulse={pay.status === "PENDING_VERIFICATION"}
                      className="font-mono text-[9px]"
                    >
                      {pay.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {pay.status === "PENDING_VERIFICATION" ? (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleVerify(pay.id)}
                        className="h-7 text-xs font-bold gap-1 cursor-pointer"
                      >
                        <Check className="h-3 w-3" />
                        <span>Verify & Recharge</span>
                      </Button>
                    ) : (
                      <span className="text-[11px] font-mono text-muted-foreground">
                        Verified by {pay.verifiedBy}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
