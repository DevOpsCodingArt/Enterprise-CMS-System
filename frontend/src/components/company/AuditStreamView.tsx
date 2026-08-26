"use client";

import React, { useState } from "react";
import {
  FileText,
  Shield,
  Search,
  Lock,
  Clock,
  User,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Filter,
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

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  module: string;
  ipAddress: string;
  status: "SUCCESS" | "BLOCKED_ATTEMPT" | "WARNING";
  details: string;
}

export function AuditStreamView() {
  const [searchTerm, setSearchTerm] = useState("");

  const auditLogs: AuditLogItem[] = [
    {
      id: "log-01",
      timestamp: "Today, 04:30 PM",
      actorName: "Tariq Mehmood (CEO)",
      actorRole: "Company Owner",
      action: "role.update_permissions",
      module: "RBAC Engine",
      ipAddress: "103.14.22.1",
      status: "SUCCESS",
      details: "Granted 'inventory.consume' and 'field.calibrate_line' to role 'Senior Fiber Splicer'.",
    },
    {
      id: "log-02",
      timestamp: "Today, 04:15 PM",
      actorName: "Usman Ali",
      actorRole: "Lead Fiber Splicer",
      action: "field.calibrate_line",
      module: "Field Ops",
      ipAddress: "39.40.12.84",
      status: "SUCCESS",
      details: "Logged optical power calibration of -18.2 dBm on CUS-99482 GPON 0/2/4 Splitter #4.",
    },
    {
      id: "log-03",
      timestamp: "Today, 03:50 PM",
      actorName: "Fatima Noor",
      actorRole: "Helpdesk CSR",
      action: "company.roles.access_attempt",
      module: "Security Edge",
      ipAddress: "103.14.22.14",
      status: "BLOCKED_ATTEMPT",
      details: "Direct URL navigation to /company/roles intercepted by Next.js Edge middleware. Redirected to /company/desk.",
    },
    {
      id: "log-04",
      timestamp: "Today, 03:10 PM",
      actorName: "Bilal Hassan",
      actorRole: "Billing Lead",
      action: "payment.verify",
      module: "Billing",
      ipAddress: "103.14.22.5",
      status: "SUCCESS",
      details: "Verified 1Link 1Bill transaction #1BILL-998241 for PKR 240,000.",
    },
  ];

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
            Security Stream & Administrative Audit Trail
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Immutable audit record of all permission changes, staff logins, payment approvals, and Edge security intercepts.
          </p>
        </div>

        <Badge variant="success" className="font-mono text-xs">
          🔒 IMMUTABLE POSTGRES RLS LOG
        </Badge>
      </div>

      {/* 2. Search */}
      <div className="relative max-w-sm w-full">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Filter audit events by actor, action, or module..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 text-xs"
        />
      </div>

      {/* 3. Audit Table */}
      <Card className="bg-card border-border shadow-xs">
        <CardHeader className="p-4 border-b border-border bg-card-subtle/50">
          <CardTitle className="text-sm font-heading font-bold">
            Real-Time Audit Event Ledger
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor / Staff</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Event Details</TableHead>
                <TableHead className="text-right">Outcome</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-card-subtle/40 transition-colors">
                  <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <div>
                      <span className="font-bold text-xs text-foreground block">
                        {log.actorName}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {log.actorRole}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-primary font-bold">
                    {log.action}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {log.module}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {log.ipAddress}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-sm">
                    {log.details}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={
                        log.status === "SUCCESS"
                          ? "success"
                          : log.status === "BLOCKED_ATTEMPT"
                          ? "destructive"
                          : "warning"
                      }
                      className="font-mono text-[9px]"
                    >
                      {log.status.replace("_", " ")}
                    </Badge>
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
