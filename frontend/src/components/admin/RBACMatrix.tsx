"use client";

import React, { useState } from "react";
import { Shield, Check, X, Plus, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

export interface PermissionModule {
  module: string;
  actions: {
    name: string;
    description: string;
    companyOwner: boolean;
    branchManager: boolean;
    nocEngineer: boolean;
    helpdeskCSR: boolean;
    fieldEngineer: boolean;
  }[];
}

export function RBACMatrix() {
  const toast = useToast();
  const [permissions] = useState<PermissionModule[]>([
    {
      module: "Prime Desk (Live Chat)",
      actions: [
        {
          name: "chat.view",
          description: "View incoming conversation streams",
          companyOwner: true,
          branchManager: true,
          nocEngineer: true,
          helpdeskCSR: true,
          fieldEngineer: false,
        },
        {
          name: "chat.send",
          description: "Dispatch messages to subscribers",
          companyOwner: true,
          branchManager: true,
          nocEngineer: true,
          helpdeskCSR: true,
          fieldEngineer: false,
        },
        {
          name: "chat.transfer",
          description: "Re-assign chat session to other branches/agents",
          companyOwner: true,
          branchManager: true,
          nocEngineer: true,
          helpdeskCSR: true,
          fieldEngineer: false,
        },
        {
          name: "chat.add_internal_note",
          description: "Post internal staff-only notes on timeline",
          companyOwner: true,
          branchManager: true,
          nocEngineer: true,
          helpdeskCSR: true,
          fieldEngineer: true,
        },
      ],
    },
    {
      module: "Trouble Tickets & Dispatch",
      actions: [
        {
          name: "tickets.create",
          description: "Lodge new trouble complaints",
          companyOwner: true,
          branchManager: true,
          nocEngineer: true,
          helpdeskCSR: true,
          fieldEngineer: true,
        },
        {
          name: "tickets.assign_van",
          description: "Dispatch splicer vans to field locations",
          companyOwner: true,
          branchManager: true,
          nocEngineer: true,
          helpdeskCSR: false,
          fieldEngineer: false,
        },
        {
          name: "tickets.resolve",
          description: "Close ticket with optical attenuation verification",
          companyOwner: true,
          branchManager: true,
          nocEngineer: true,
          helpdeskCSR: false,
          fieldEngineer: true,
        },
      ],
    },
    {
      module: "NOC Telemetry & Hardware",
      actions: [
        {
          name: "noc.view_olt",
          description: "View SmartOLT optical light power & temperatures",
          companyOwner: true,
          branchManager: true,
          nocEngineer: true,
          helpdeskCSR: true,
          fieldEngineer: true,
        },
        {
          name: "noc.reboot_onu",
          description: "Send remote power-cycle command to customer modem",
          companyOwner: true,
          branchManager: true,
          nocEngineer: true,
          helpdeskCSR: true,
          fieldEngineer: true,
        },
        {
          name: "noc.configure_vlan",
          description: "Modify core PON port and VLAN routing tables",
          companyOwner: true,
          branchManager: false,
          nocEngineer: true,
          helpdeskCSR: false,
          fieldEngineer: false,
        },
      ],
    },
  ]);

  return (
    <Card className="bg-card border-border shadow-xs">
      <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-heading font-bold">
            Granular RBAC Permissions Matrix
          </CardTitle>
          <CardDescription className="text-xs">
            Hybrid module & action-level permission rules controlling staff access across all 20 branch offices.
          </CardDescription>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => toast.success("Permissions Saved", "RBAC policy synchronized across all 20 branches.")}
          className="gap-1.5 shadow-xs text-xs"
        >
          <Save className="h-3.5 w-3.5" />
          <span>Save Changes</span>
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Permission Action & Description</TableHead>
              <TableHead className="text-center">CEO</TableHead>
              <TableHead className="text-center">Branch Mgr</TableHead>
              <TableHead className="text-center">NOC Lead</TableHead>
              <TableHead className="text-center">CSR Agent</TableHead>
              <TableHead className="text-center">Field Splicer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((group) => (
              <React.Fragment key={group.module}>
                <TableRow className="bg-card-subtle/60 font-bold">
                  <TableCell colSpan={6} className="text-xs text-primary font-mono uppercase tracking-wider py-2">
                    📦 {group.module}
                  </TableCell>
                </TableRow>
                {group.actions.map((act) => (
                  <TableRow key={act.name}>
                    <TableCell>
                      <span className="font-mono font-bold text-foreground text-xs block">
                        {act.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground block">
                        {act.description}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      {act.companyOwner ? (
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {act.branchManager ? (
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {act.nocEngineer ? (
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {act.helpdeskCSR ? (
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      {act.fieldEngineer ? (
                        <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
