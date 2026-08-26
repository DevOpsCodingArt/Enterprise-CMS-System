"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Shield,
  Building2,
  Phone,
  Mail,
  Truck,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  UserCheck,
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
import { Avatar } from "@/components/ui/avatar";
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
import { useTenantStore } from "@/stores/useTenantStore";
import { useToast } from "@/components/ui/toast";

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: "Helpdesk" | "Field Operations" | "Accounts" | "NOC" | "Branch Management";
  customRole: string;
  branchName: string;
  status: "active" | "on_shift" | "on_break" | "offline";
  vanNumber?: string;
}

export function StaffWorkforceView() {
  const toast = useToast();
  const { branches } = useTenantStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("Field Fiber Splicer");
  const [newStaffBranch, setNewStaffBranch] = useState("Islamabad Blue Area (HQ)");

  const [staffList, setStaffList] = useState<StaffMember[]>([
    {
      id: "usr-01",
      name: "Usman Ali",
      email: "usman.field@primenetworks.pk",
      phone: "+92 300 5551101",
      department: "Field Operations",
      customRole: "Lead Fiber Splicer",
      branchName: "Islamabad Blue Area (HQ)",
      status: "on_shift",
      vanNumber: "VAN #04",
    },
    {
      id: "usr-02",
      name: "Fatima Noor",
      email: "fatima.noor@primenetworks.pk",
      phone: "+92 301 4442202",
      department: "Helpdesk",
      customRole: "Senior Helpdesk CSR",
      branchName: "Islamabad Blue Area (HQ)",
      status: "on_shift",
    },
    {
      id: "usr-03",
      name: "Zubair Ahmed",
      email: "noc.lead@primenetworks.pk",
      phone: "+92 302 3331103",
      department: "NOC",
      customRole: "NOC Optical Engineer",
      branchName: "Islamabad Blue Area (HQ)",
      status: "on_shift",
    },
    {
      id: "usr-04",
      name: "Bilal Hassan",
      email: "billing@primenetworks.pk",
      phone: "+92 303 2229904",
      department: "Accounts",
      customRole: "Billing Verification Lead",
      branchName: "Islamabad Blue Area (HQ)",
      status: "active",
    },
    {
      id: "usr-05",
      name: "Khurram Shahzad",
      email: "manager.lhr@primenetworks.pk",
      phone: "+92 304 1118805",
      department: "Branch Management",
      customRole: "Branch Operations Supervisor",
      branchName: "Lahore Gulberg III",
      status: "on_shift",
    },
    {
      id: "usr-06",
      name: "Hamza Tariq",
      email: "hamza.field@primenetworks.pk",
      phone: "+92 305 9997706",
      department: "Field Operations",
      customRole: "Drop Cable Specialist",
      branchName: "Rawalpindi Saddar",
      status: "on_shift",
      vanNumber: "VAN #02",
    },
  ]);

  const filteredStaff = staffList.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.branchName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === "all" || s.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  const handleOnboardStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: StaffMember = {
      id: `usr-${Date.now()}`,
      name: newStaffName,
      email: newStaffEmail,
      phone: "+92 300 0000000",
      department: newStaffRole.includes("Splicer") ? "Field Operations" : "Helpdesk",
      customRole: newStaffRole,
      branchName: newStaffBranch,
      status: "active",
    };

    setStaffList([newMember, ...staffList]);
    setIsOnboardModalOpen(false);
    setNewStaffName("");
    setNewStaffEmail("");
    toast.success("Staff Account Created", `${newMember.name} provisioned under ${newMember.customRole}.`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-heading font-extrabold text-foreground tracking-tight">
            Company Workforce & Staff Directory
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Directory of all 52 staff members (12 CSRs, 40 Field Technicians, Accounts Officers) across 20 operational hubs.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsOnboardModalOpen(true)}
          className="gap-1.5 font-bold shadow-xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Onboard New Staff</span>
        </Button>
      </div>

      {/* 2. Search & Department Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name, role, email, or branch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["all", "Helpdesk", "Field Operations", "Accounts", "NOC", "Branch Management"].map((dept) => (
            <Button
              key={dept}
              variant={departmentFilter === dept ? "primary" : "outline"}
              size="sm"
              onClick={() => setDepartmentFilter(dept)}
              className="text-xs rounded-lg whitespace-nowrap cursor-pointer"
            >
              {dept === "all" ? "All Departments" : dept}
            </Button>
          ))}
        </div>
      </div>

      {/* 3. Staff Table */}
      <Card className="bg-card border-border shadow-xs">
        <CardHeader className="p-4 border-b border-border bg-card-subtle/50 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-heading font-bold">
            Staff Accounts & Active Duty Roster
          </CardTitle>
          <Badge variant="secondary" className="font-mono text-xs">
            {filteredStaff.length} Displayed
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Assigned Custom Role</TableHead>
                <TableHead>Branch Office</TableHead>
                <TableHead>Field Van</TableHead>
                <TableHead className="text-right">Duty Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((staff) => (
                <TableRow key={staff.id} className="hover:bg-card-subtle/40 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar name={staff.name} size="sm" presence="online" />
                      <div>
                        <span className="font-bold text-xs text-foreground block">
                          {staff.name}
                        </span>
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {staff.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {staff.department}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-[10px]">
                      {staff.customRole}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-medium">
                    {staff.branchName}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-primary font-bold">
                    {staff.vanNumber || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={staff.status === "on_shift" ? "success" : "secondary"}
                      hasPulse={staff.status === "on_shift"}
                      className="font-mono text-[9px] uppercase"
                    >
                      {staff.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Onboard Staff Modal */}
      <Dialog
        isOpen={isOnboardModalOpen}
        onClose={() => setIsOnboardModalOpen(false)}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <span>Onboard New Staff Member</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleOnboardStaff}>
          <DialogContent className="space-y-4">
            <Input
              label="Full Legal Name"
              placeholder="e.g. Asim Riaz"
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              required
            />

            <Input
              label="Company Work Email"
              type="email"
              placeholder="e.g. asim.riaz@primenetworks.pk"
              value={newStaffEmail}
              onChange={(e) => setNewStaffEmail(e.target.value)}
              required
            />

            <Input
              label="Assigned Role"
              value={newStaffRole}
              onChange={(e) => setNewStaffRole(e.target.value)}
              required
            />

            <Input
              label="Assigned Branch Hub"
              value={newStaffBranch}
              onChange={(e) => setNewStaffBranch(e.target.value)}
              required
            />
          </DialogContent>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsOnboardModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Provision Staff Account
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
