"use client";

import React, { useState } from "react";
import { Search, Plus, X, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockDb, StaffUserRecord } from "@/mock/db";

export function StaffDirectoryTab() {
  const [staffList, setStaffList] = useState<StaffUserRecord[]>(mockDb.staff);
  const [searchStaff, setSearchStaff] = useState("");
  const [isProvisionStaffOpen, setIsProvisionStaffOpen] = useState(false);

  // New Staff Form State
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");
  const [newStaffDept, setNewStaffDept] = useState("Helpdesk & Customer Support (L1/L2)");
  const [newStaffRole, setNewStaffRole] = useState("Helpdesk Agent (L1/L2)");
  const [newStaffBranch] = useState("Islamabad Core (F-10 HQ)");

  const filteredStaff = staffList.filter((s) => {
    if (searchStaff.trim()) {
      const q = searchStaff.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.designation.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff: StaffUserRecord = {
      id: `usr-${Date.now()}`,
      name: newStaffName || "New Employee",
      email: newStaffEmail || "staff@primenetworks.pk",
      phone: newStaffPhone || "+92 300 0000000",
      department: newStaffDept,
      designation: newStaffRole,
      branchId: "br-isb-01",
      branchName: newStaffBranch,
      roleId: "role-helpdesk",
      roleName: newStaffRole,
      status: "online",
      tasksCompletedToday: 0,
      csatRating: 5.0,
      joinedDate: new Date().toISOString().split("T")[0],
    };

    setStaffList([newStaff, ...staffList]);
    setIsProvisionStaffOpen(false);
    setNewStaffName("");
    setNewStaffEmail("");
    setNewStaffPhone("");
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Top Filter Bar */}
      <div className="p-3.5 border-b border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search staff by name, email, department, designation..."
            value={searchStaff}
            onChange={(e) => setSearchStaff(e.target.value)}
            className="w-full text-xs bg-muted/30 rounded-lg px-3 py-1.5 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <Button size="sm" onClick={() => setIsProvisionStaffOpen(true)}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Provision Staff User
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-heading font-bold text-sm border border-primary/20">
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-foreground">{staff.name}</h3>
                    <div className="text-[11px] text-muted-foreground">{staff.designation}</div>
                  </div>
                </div>

                <Badge
                  variant={
                    staff.status === "online"
                      ? "success"
                      : staff.status === "field"
                        ? "warning"
                        : "secondary"
                  }
                  className="text-[10px]"
                >
                  {staff.status === "online" ? "Online" : staff.status === "field" ? "On-Site Field" : "On Shift"}
                </Badge>
              </div>

              <div className="space-y-1 text-[11px] text-muted-foreground font-mono">
                <div className="flex justify-between">
                  <span>Department:</span>
                  <span className="text-foreground truncate max-w-[170px]">{staff.department}</span>
                </div>
                <div className="flex justify-between">
                  <span>Branch Hub:</span>
                  <span className="text-foreground font-bold">{staff.branchName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mobile:</span>
                  <span className="text-foreground">{staff.phone}</span>
                </div>
                {staff.assignedVan && (
                  <div className="flex justify-between text-warning font-bold">
                    <span>Vehicle:</span>
                    <span>{staff.assignedVan}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border text-[11px] font-mono">
                <span className="text-emerald-600 font-bold">★ {staff.csatRating} CSAT</span>
                <span className="text-muted-foreground">{staff.tasksCompletedToday} Tasks Completed</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PROVISION STAFF USER MODAL */}
      {isProvisionStaffOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-heading font-bold text-base text-foreground">
                Provision New Staff Member
              </h3>
              <button onClick={() => setIsProvisionStaffOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-muted-foreground mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Imran Khan"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground"
                />
              </div>

              <div>
                <label className="block font-bold text-muted-foreground mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="imran@primenetworks.pk"
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-muted-foreground mb-1">Mobile Phone</label>
                <input
                  type="text"
                  required
                  placeholder="+92 300 1234567"
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-muted-foreground mb-1">Department</label>
                <select
                  value={newStaffDept}
                  onChange={(e) => setNewStaffDept(e.target.value)}
                  className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground"
                >
                  {mockDb.departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-muted-foreground mb-1">Designation & Role</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Field Splicer / Helpdesk Agent"
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full bg-muted/30 rounded-lg p-2 border border-border text-foreground"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsProvisionStaffOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="flex-1">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Provision User & Send Invite
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
