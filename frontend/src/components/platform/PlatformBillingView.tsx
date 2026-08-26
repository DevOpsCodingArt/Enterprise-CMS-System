"use client";

import React from "react";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Download,
  CheckCircle2,
  AlertCircle,
  Plus,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export function PlatformBillingView() {
  const toast = useToast();

  const plans = [
    {
      name: "Starter ISP",
      price: "$499",
      billing: "/month",
      description: "For emerging regional ISPs with up to 5 branch hubs.",
      branches: "Up to 5 Branches",
      subscribers: "25,000 Subscribers",
      activeTenants: 2,
    },
    {
      name: "Growth Telecom",
      price: "$1,499",
      billing: "/month",
      description: "For mid-market metro ISPs with up to 10 branch hubs.",
      branches: "Up to 10 Branches",
      subscribers: "75,000 Subscribers",
      activeTenants: 3,
    },
    {
      name: "Enterprise Fleet",
      price: "$3,999+",
      billing: "/month",
      description: "For tier-1 nationwide telecom operators with 20+ branches.",
      branches: "Unlimited Branches",
      subscribers: "500,000 Subscribers",
      activeTenants: 3,
    },
  ];

  const tenantInvoices = [
    {
      id: "SAAS-INV-9901",
      tenant: "Prime Networks (Pvt) Ltd",
      amount: "$4,850.00",
      tier: "Enterprise Tier + Telemetry Addon",
      date: "01 Sep 2024",
      status: "paid" as const,
    },
    {
      id: "SAAS-INV-9902",
      tenant: "FiberLink Telecom",
      amount: "$3,400.00",
      tier: "Enterprise Tier",
      date: "01 Sep 2024",
      status: "paid" as const,
    },
    {
      id: "SAAS-INV-9903",
      tenant: "NetSpeed Metro Broadband",
      amount: "$1,950.00",
      tier: "Growth Tier + Custom RBAC",
      date: "01 Sep 2024",
      status: "paid" as const,
    },
    {
      id: "SAAS-INV-9904",
      tenant: "OpticWave Communications",
      amount: "$850.00",
      tier: "Starter Tier",
      date: "01 Sep 2024",
      status: "pending" as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div>
        <h2 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
          SaaS Subscription Tiers & Revenue Collection
        </h2>
        <p className="text-xs text-muted-foreground">
          Platform-wide licensing plans, monthly recurring billing, and automated invoice lifecycle.
        </p>
      </div>

      {/* 2. SaaS Subscription Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <Card key={p.name} className="p-5 space-y-4 bg-card border-border shadow-xs">
            <div className="flex justify-between items-center">
              <span className="font-heading font-bold text-base text-foreground">
                {p.name}
              </span>
              <Badge variant="info" className="font-mono text-[9px]">
                {p.activeTenants} TENANTS
              </Badge>
            </div>

            <div>
              <span className="font-heading font-extrabold text-3xl text-foreground">
                {p.price}
              </span>
              <span className="text-xs text-muted-foreground font-mono">{p.billing}</span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>

            <div className="space-y-1.5 pt-2 border-t border-border text-xs font-mono">
              <div className="flex items-center gap-1.5 text-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>{p.branches}</span>
              </div>
              <div className="flex items-center gap-1.5 text-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                <span>{p.subscribers}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 3. Monthly Invoices Table */}
      <Card className="bg-card border-border shadow-xs">
        <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-heading font-bold">
              Recent Multi-Tenant Billing Invoices
            </CardTitle>
            <CardDescription className="text-xs">
              Automated SaaS invoices issued on the 1st of each billing cycle.
            </CardDescription>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.info("Invoice Generator", "Generating draft billing batch for upcoming cycle.")
            }
            className="text-xs gap-1.5 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Generate Invoices</span>
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>ISP Tenant Company</TableHead>
                <TableHead>Plan & Addons</TableHead>
                <TableHead>Issued Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenantInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono font-bold text-primary">
                    {inv.id}
                  </TableCell>
                  <TableCell className="font-bold text-foreground">
                    {inv.tenant}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {inv.tier}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {inv.date}
                  </TableCell>
                  <TableCell className="font-mono font-bold text-foreground">
                    {inv.amount}
                  </TableCell>
                  <TableCell>
                    <Badge variant={inv.status === "paid" ? "success" : "warning"}>
                      {inv.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        toast.success("Downloaded", `Downloaded invoice ${inv.id}`)
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
    </div>
  );
}
