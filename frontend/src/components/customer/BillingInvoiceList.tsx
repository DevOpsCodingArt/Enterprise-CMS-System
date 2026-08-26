"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  Receipt,
  Plus,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/toast";

export function BillingInvoiceList() {
  const toast = useToast();
  const invoices = [
    {
      id: "INV-2024-09",
      billingMonth: "September 2024",
      amount: "Rs. 3,500",
      dueDate: "05 Sep 2024",
      paidDate: "03 Sep 2024",
      status: "paid" as const,
      paymentMethod: "Bank Alfalah Raast Transfer",
    },
    {
      id: "INV-2024-08",
      billingMonth: "August 2024",
      amount: "Rs. 3,500",
      dueDate: "05 Aug 2024",
      paidDate: "04 Aug 2024",
      status: "paid" as const,
      paymentMethod: "Easypaisa Direct",
    },
    {
      id: "INV-2024-07",
      billingMonth: "July 2024",
      amount: "Rs. 3,500",
      dueDate: "05 Jul 2024",
      paidDate: "05 Jul 2024",
      status: "paid" as const,
      paymentMethod: "Nayapay Card",
    },
  ];

  return (
    <Card className="bg-card border-border shadow-xs">
      <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-heading font-bold">
            ZL Ultra Billing History & Receipts
          </CardTitle>
          <span className="text-xs text-muted-foreground">
            Synchronized with ISP billing engine.
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toast.info(
              "Upload Proof",
              "Select bank receipt screenshot to verify invoice."
            )
          }
          className="text-xs gap-1.5 shadow-xs"
        >
          <Upload className="h-3 w-3" />
          <span>Upload Payment Proof</span>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Billing Month</TableHead>
              <TableHead>Package Amount</TableHead>
              <TableHead>Paid On</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-mono font-bold text-primary">
                  {inv.id}
                </TableCell>
                <TableCell className="font-bold text-foreground">
                  {inv.billingMonth}
                </TableCell>
                <TableCell className="font-mono font-bold text-foreground">
                  {inv.amount}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground font-mono">
                  {inv.paidDate} ({inv.paymentMethod})
                </TableCell>
                <TableCell>
                  <Badge variant="success">PAID</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast.success(
                        "Downloaded",
                        `Downloaded receipt PDF for ${inv.id}`
                      )
                    }
                    className="h-7 text-xs px-2"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
