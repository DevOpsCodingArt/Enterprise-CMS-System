"use client";

import React, { useState } from "react";
import {
  Download,
  CreditCard,
  Check,
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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";
import { PaymentModal } from "@/components/customer/PaymentModal";

interface Invoice {
  id: string;
  invoiceNo: string;
  billingMonth: string;
  amount: number;
  dueDate: string;
  status: "paid" | "unpaid" | "verification_pending" | "overdue";
  paidAt?: string;
  paymentMethod?: string;
  tidReference?: string;
}

export function PortalBillingView() {
  const toast = useToast();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "inv-01",
      invoiceNo: "INV-2026-08-99482",
      billingMonth: "August 2026",
      amount: 3500,
      dueDate: "2026-08-30",
      status: "unpaid",
    },
    {
      id: "inv-02",
      invoiceNo: "INV-2026-07-99482",
      billingMonth: "July 2026",
      amount: 3500,
      dueDate: "2026-07-30",
      status: "verification_pending",
      paidAt: "2026-08-26",
      paymentMethod: "JazzCash QR",
      tidReference: "TID #8849102",
    },
    {
      id: "inv-03",
      invoiceNo: "INV-2026-06-99482",
      billingMonth: "June 2026",
      amount: 3500,
      dueDate: "2026-06-30",
      status: "paid",
      paidAt: "2026-06-27",
      paymentMethod: "1Link 1Bill",
      tidReference: "1BILL-9948201",
    },
    {
      id: "inv-04",
      invoiceNo: "INV-2026-05-99482",
      billingMonth: "May 2026",
      amount: 3500,
      dueDate: "2026-05-30",
      status: "paid",
      paidAt: "2026-05-29",
      paymentMethod: "EasyPaisa",
      tidReference: "EP-3349102",
    },
  ]);

  const handleDownloadInvoice = (inv: Invoice) => {
    toast.success("Invoice Downloaded", `Saved ${inv.invoiceNo}.pdf to your device.`);
  };

  const handleOpenPayment = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedInvoice) {
      setInvoices((prev) =>
        prev.map((i) =>
          i.id === selectedInvoice.id
            ? {
                ...i,
                status: "verification_pending",
                paidAt: new Date().toISOString().split("T")[0],
                paymentMethod: "Online Proof Submitted",
                tidReference: `TID #${Math.floor(1000000 + Math.random() * 9000000)}`,
              }
            : i
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Outstanding Balance & Quick Checkout Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 bg-card border-border shadow-xs md:col-span-2 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Current Outstanding Balance
              </span>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="font-heading font-extrabold text-3xl text-foreground">
                  PKR 3,500
                </span>
                <Badge variant="warning" className="font-mono text-xs font-bold">
                  DUE AUG 30, 2026
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Plan: <strong>Fiber Pro 50 Mbps Unlimited</strong> (All Taxes & Maintenance Included).
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => handleOpenPayment(invoices[0])}
              className="w-full sm:w-auto gap-2 shadow-xs font-bold"
            >
              <CreditCard className="h-4 w-4" />
              <span>Pay Bill Online</span>
            </Button>
          </div>

          <div className="mt-4 pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground font-mono">
            <span>Payment Gateways: <strong>JazzCash • EasyPaisa • 1Link • Raast</strong></span>
            <span className="text-success font-bold flex items-center gap-1">
              <Check className="h-3.5 w-3.5" /> Instant Session Refresh
            </span>
          </div>
        </Card>

        <Card className="p-5 bg-card border-border shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Billing Ledger Status
            </span>
            <div className="mt-2 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-muted-foreground">Subscriber ID:</span>
                <span className="font-mono font-bold text-foreground">CUS-99482</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border-subtle">
                <span className="text-muted-foreground">Billing Cycle:</span>
                <span className="font-bold text-foreground">Monthly (1st to 30th)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Account Status:</span>
                <Badge variant="success" className="text-[9px] font-mono">
                  ACTIVE LINE
                </Badge>
              </div>
            </div>
          </div>

          <span className="text-[11px] font-mono text-muted-foreground block mt-2">
            Automated invoices generated via ZL Ultra Billing Engine.
          </span>
        </Card>
      </div>

      {/* 2. Invoices Table */}
      <Card className="bg-card border-border shadow-xs">
        <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-sm font-heading font-bold">
              Invoice History & Ledger Records
            </CardTitle>
            <CardDescription className="text-xs">
              FBR-compliant monthly bills, verification states, and transaction receipts.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono">
              {invoices.length} Total Invoices
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Billing Month</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment / Reference</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono font-bold text-foreground">
                    {inv.invoiceNo}
                  </TableCell>
                  <TableCell className="font-medium text-xs">
                    {inv.billingMonth}
                  </TableCell>
                  <TableCell className="font-mono font-bold text-foreground">
                    PKR {inv.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {inv.dueDate}
                  </TableCell>
                  <TableCell>
                    {inv.status === "paid" && (
                      <Badge variant="success" className="text-[10px] py-0 px-1.5 font-mono">
                        PAID
                      </Badge>
                    )}
                    {inv.status === "unpaid" && (
                      <Badge variant="warning" className="text-[10px] py-0 px-1.5 font-mono">
                        UNPAID
                      </Badge>
                    )}
                    {inv.status === "verification_pending" && (
                      <Badge variant="info" hasPulse className="text-[10px] py-0 px-1.5 font-mono">
                        VERIFICATION PENDING
                      </Badge>
                    )}
                    {inv.status === "overdue" && (
                      <Badge variant="destructive" className="text-[10px] py-0 px-1.5 font-mono">
                        OVERDUE
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {inv.tidReference ? (
                      <div className="space-y-0.5">
                        <span className="font-bold text-foreground block">{inv.tidReference}</span>
                        <span className="text-[10px] text-muted-foreground">{inv.paymentMethod}</span>
                      </div>
                    ) : (
                      <span>{inv.paymentMethod || "Pending Payment"}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadInvoice(inv)}
                        className="h-7 text-xs gap-1"
                        title="Download PDF"
                      >
                        <Download className="h-3 w-3" />
                        <span className="hidden sm:inline">PDF</span>
                      </Button>

                      {inv.status === "unpaid" && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenPayment(inv)}
                          className="h-7 text-xs font-bold"
                        >
                          Pay Now
                        </Button>
                      )}

                      {inv.status === "verification_pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.info("Verification", "NOC Accounts team is verifying your payment screenshot.")}
                          className="h-7 text-[11px] text-info border-info/30"
                        >
                          Checking...
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {selectedInvoice && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          invoiceNo={selectedInvoice.invoiceNo}
          amount={selectedInvoice.amount}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
