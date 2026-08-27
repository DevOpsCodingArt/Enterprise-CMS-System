"use client";

import React, { useState } from "react";
import {
  Building,
  Clock,
  Timer,
  CheckSquare,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  MapPin,
  Shield,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronRight,
  TrendingUp,
  X,
  Truck,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  mockDb,
  DepartmentRecord,
  StaffUserRecord,
  ShiftRoster,
  AttendanceRecord,
  WorkOrderTask,
} from "@/mock/db";
import { cn } from "@/lib/utils";

export function WorkforceHrView({ initialSubTab = "departments" }: { initialSubTab?: string }) {
  const activeTab = initialSubTab;

  const [staffList, setStaffList] = useState<StaffUserRecord[]>(mockDb.staff);
  const [departmentList, setDepartmentList] = useState<DepartmentRecord[]>(mockDb.departments);
  const [shiftList, setShiftList] = useState<ShiftRoster[]>(mockDb.shifts);
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>(mockDb.attendance);
  const [tasksList, setTasksList] = useState<WorkOrderTask[]>(mockDb.workOrders);

  const [searchStaff, setSearchStaff] = useState("");
  const [isProvisionStaffOpen, setIsProvisionStaffOpen] = useState(false);

  // New Staff Form State
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");
  const [newStaffDept, setNewStaffDept] = useState("Helpdesk & Customer Support (L1/L2)");
  const [newStaffRole, setNewStaffRole] = useState("Helpdesk Agent (L1/L2)");
  const [newStaffBranch, setNewStaffBranch] = useState("Islamabad Core (F-10 HQ)");

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
    <div className="h-full w-full font-body flex flex-col overflow-hidden">
      {/* =========================================================================
          TAB 1: DEPARTMENTS
      ========================================================================= */}
      {activeTab === "departments" && (
        <div className="h-full w-full flex flex-col overflow-hidden">
          {/* Top Header Bar (Flush with top) */}
          <div className="p-3.5 border-b border-border bg-card flex items-center justify-between shrink-0">
            <div>
              <h2 className="font-heading font-bold text-sm text-foreground">
                Organizational Departments & Escalation Hierarchy
              </h2>
              <p className="text-xs text-muted-foreground">
                Configure operational divisions, department heads, and automated ticket escalation paths.
              </p>
            </div>
            <Button size="sm" onClick={() => alert("Open Add Department Modal")}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Department
            </Button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {departmentList.map((dept) => (
                <div
                  key={dept.id}
                  className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: dept.color }}
                      />
                      <span className="font-mono font-bold text-xs text-primary">{dept.code}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      {dept.headcount} Members
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-sm text-foreground">{dept.name}</h3>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Lead: <span className="font-bold text-foreground">{dept.leadName}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-muted/30">
                      <div className="text-muted-foreground text-[10px]">Active Jobs</div>
                      <div className="font-bold text-foreground mt-0.5">{dept.activeTickets} Tickets</div>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/30">
                      <div className="text-muted-foreground text-[10px]">SLA Target</div>
                      <div className="font-bold text-emerald-600 mt-0.5">{dept.slaTargetHours}h Turnaround</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: STAFF DIRECTORY
      ========================================================================= */}
      {activeTab === "staff" && (
        <div className="h-full w-full flex flex-col overflow-hidden">
          {/* Top Filter Bar (Flush with top) */}
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
        </div>
      )}

      {/* =========================================================================
          TAB 3: SHIFT ROSTERS (24/7 NOC)
      ========================================================================= */}
      {activeTab === "shifts" && (
        <div className="h-full w-full flex flex-col overflow-hidden">
          {/* Top Header Bar (Flush with top) */}
          <div className="p-3.5 border-b border-border bg-card flex items-center justify-between shrink-0">
            <div>
              <h2 className="font-heading font-bold text-sm text-foreground">
                24/7/365 Continuous Operational Shift Rosters
              </h2>
              <p className="text-xs text-muted-foreground">
                Scheduled morning, evening peak, and night NOC shift allocations with on-call emergency splicers.
              </p>
            </div>
            <Button size="sm" onClick={() => alert("Open Schedule Shift Modal")}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Shift Roster
            </Button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {shiftList.map((shift) => (
                <div
                  key={shift.id}
                  className="p-4 rounded-2xl bg-card border border-border shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-warning" />
                      <span className="font-heading font-bold text-xs text-foreground uppercase">{shift.shiftName}</span>
                    </div>
                    <Badge variant="warning" className="text-[10px] font-mono">{shift.timeRange}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-bold text-muted-foreground">Assigned Active Staff ({shift.assignedStaff.length}):</div>
                    <div className="flex flex-wrap gap-1.5">
                      {shift.assignedStaff.map((staffName, i) => (
                        <span key={i} className="px-2 py-1 rounded-md bg-muted/60 border border-border text-xs font-medium text-foreground">
                          {staffName}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border/80 space-y-1 text-xs">
                    <div className="text-[10.5px] font-bold text-primary">On-Call Standby Splicers:</div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {shift.onCallStandby.join(", ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: ATTENDANCE & OVERTIME
      ========================================================================= */}
      {activeTab === "attendance" && (
        <div className="h-full w-full flex flex-col overflow-hidden">
          {/* Top Header Bar (Flush with top) */}
          <div className="p-3.5 border-b border-border bg-card flex items-center justify-between shrink-0">
            <div>
              <h2 className="font-heading font-bold text-sm text-foreground">
                Staff Biometric & Geofenced Mobile Attendance & Overtime Tracker
              </h2>
              <p className="text-xs text-muted-foreground">
                Daily clock-in logs, late arrivals, and emergency night fiber restoration overtime (1.5x / 2.0x rates).
              </p>
            </div>
            <Badge variant="success" className="text-xs font-mono">
              Today: 98% Present
            </Badge>
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-muted/70 backdrop-blur-xs border-b border-border text-[11px] font-mono uppercase text-muted-foreground z-10">
                <tr>
                  <th className="p-3">Staff Member</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Clock-In Time</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Late Status</th>
                  <th className="p-3">Overtime Logged</th>
                  <th className="p-3">Attendance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {attendanceList.map((att) => (
                  <tr key={att.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-bold text-foreground">{att.staffName}</td>
                    <td className="p-3 text-muted-foreground">{att.department}</td>
                    <td className="p-3 font-mono font-bold text-primary">{att.clockIn}</td>
                    <td className="p-3">
                      <Badge variant="secondary" className="text-[10px]">
                        {att.checkInMethod === "geofenced_mobile" ? "📱 Mobile GPS Geofence" : "🏢 Office Biometric"}
                      </Badge>
                    </td>
                    <td className="p-3 font-mono">
                      {att.isLate ? (
                        <span className="text-destructive font-bold">Late (12 mins)</span>
                      ) : (
                        <span className="text-emerald-600">On Time</span>
                      )}
                    </td>
                    <td className="p-3 font-mono">
                      {att.overtimeHours > 0 ? (
                        <span className="text-warning font-bold">
                          {att.overtimeHours} hrs ({att.overtimeRateMultiplier}x OT Rate)
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0 hrs</span>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge variant="success" className="text-[10px]">
                        Present
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: TASK ALLOCATION BOARD
      ========================================================================= */}
      {activeTab === "tasks" && (
        <div className="h-full w-full flex flex-col overflow-hidden">
          {/* Top Header Bar (Flush with top) */}
          <div className="p-3.5 border-b border-border bg-card flex items-center justify-between shrink-0">
            <div>
              <h2 className="font-heading font-bold text-sm text-foreground">
                Field Splicing Work Orders & Technician Task Board
              </h2>
              <p className="text-xs text-muted-foreground">
                Real-time dispatch, progress updates, and completion logging for technician vans.
              </p>
            </div>
            <Button size="sm" onClick={() => alert("Open Create Work Order Modal")}>
              <Plus className="h-3.5 w-3.5 mr-1" /> New Work Order
            </Button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tasksList.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-primary">{task.taskNo}</span>
                    <Badge
                      variant={task.priority === "Critical" ? "destructive" : "warning"}
                      className="text-[10px]"
                    >
                      {task.priority}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-heading font-bold text-sm text-foreground">{task.title}</h3>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      For: <span className="font-bold text-foreground">{task.subscriberName}</span> ({task.subscriberCode})
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3 shrink-0" /> {task.address}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-muted/30 border border-border/80 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-warning font-bold">
                      <Truck className="h-3.5 w-3.5" />
                      <span>{task.assignedTo} ({task.vanNo})</span>
                    </div>
                    <Badge variant={task.status === "in_progress" ? "warning" : "secondary"}>
                      {task.status === "in_progress" ? "In Progress" : task.status === "assigned" ? "Assigned" : "To Do"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PROVISION STAFF USER MODAL
      ========================================================================= */}
      {isProvisionStaffOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
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
