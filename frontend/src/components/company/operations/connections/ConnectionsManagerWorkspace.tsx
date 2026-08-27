"use client";

import React, { useState, useMemo } from "react";
import { mockDb, NewConnectionLead } from "@/mock/db";
import { ConnectionsHeader } from "./ConnectionsHeader";
import { ConnectionsTable, ConnectionRecordItem } from "./ConnectionsTable";
import { ConnectionBottomPane } from "./ConnectionBottomPane";
import { ConnectionModals } from "./ConnectionModals";
import { useToast } from "@/components/ui/toast";

export function ConnectionsManagerWorkspace() {
  const toast = useToast();

  // Initial seed from mockDb mapped to ConnectionRecordItem
  const [connections, setConnections] = useState<ConnectionRecordItem[]>(() =>
    mockDb.newConnections.map((l: NewConnectionLead) => ({
      id: l.id,
      date: l.createdAt,
      status: l.status || "Pending",
      customer: {
        name: l.applicantName,
        fatherName: l.fatherName || "Muhammad Aslam",
        mobile: l.phone,
        cnic: l.cnic || "61101-7890123-5",
        address: l.address,
      },
      services: {
        package: l.selectedPackage,
        connectionType: l.connectionType || "Fiber",
        area: l.branchName || "Islamabad Core (F-10 HQ)",
        username: `${l.applicantName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_ftth`,
        device: l.deviceModel || "Huawei HG8145V5 Dual-Band",
        macAddress: l.macAddress || "48:57:02:11:4A:20",
        fiberWire: `${l.fiberDistanceMeters || 65}m`,
        adapter: "Yes",
        onu: "Yes",
      },
      accounts: {
        otc: l.otcPkr || 5000,
        monthlyBill: l.monthlyBillPkr || 3500,
        otcPaid: l.otcPaidPkr || 5000,
        monthlyBillPaid: l.monthlyBillPaidPkr || 0,
        totalAmount: (l.otcPkr || 5000) + (l.monthlyBillPkr || 3500),
      },
      assignment: {
        assignedTo: l.assignedVan || "Usman Ali (Van #04)",
        assignedBy: l.assignedBy || "Admin_NOC",
        remarks: l.remarks || `Nearest FAT: ${l.fatBoxNearest || "FAT-F10-18"}`,
        diagnostics: {
          signalStrength: l.opticalSignalDbm || "-14.2 dBm",
          dataUsage: "142 GB",
        },
      },
    }))
  );

  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(
    connections[0]?.id || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editConnectionId, setEditConnectionId] = useState<string | null>(null);

  const filteredConnections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return connections.filter((conn) => {
      const matchesSearch =
        !q ||
        conn.customer.name.toLowerCase().includes(q) ||
        conn.customer.mobile.includes(q) ||
        conn.customer.cnic.includes(q) ||
        conn.services.area.toLowerCase().includes(q) ||
        conn.id.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" ||
        conn.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [connections, searchQuery, statusFilter]);

  const selectedConnection = useMemo(
    () => connections.find((c) => c.id === selectedConnectionId) || null,
    [connections, selectedConnectionId]
  );

  const editConnection = useMemo(
    () => (editConnectionId ? connections.find((c) => c.id === editConnectionId) || null : null),
    [connections, editConnectionId]
  );

  // CRUD Handlers
  const handleCreate = (newConn: ConnectionRecordItem) => {
    setConnections((prev) => [newConn, ...prev]);
    setSelectedConnectionId(newConn.id);
    toast.success("Lead Created", `New connection lead ${newConn.id} has been registered.`);
  };

  const handleUpdate = (id: string, updates: Partial<ConnectionRecordItem>) => {
    setConnections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    toast.success("Lead Updated", `Connection lead ${id} has been updated.`);
  };

  const handleDelete = (id: string) => {
    setConnections((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (selectedConnectionId === id) {
        setSelectedConnectionId(filtered[0]?.id || null);
      }
      return filtered;
    });
    toast.success("Lead Deleted", `Connection lead has been removed.`);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-card border-0">
      {/* 1. Header Toolbar */}
      <ConnectionsHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onOpenCreate={() => setIsCreateOpen(true)}
      />

      {/* 2. Main Connections Table */}
      <ConnectionsTable
        connections={filteredConnections}
        selectedId={selectedConnectionId}
        onSelect={setSelectedConnectionId}
        onEdit={(id) => setEditConnectionId(id)}
        onDelete={handleDelete}
      />

      {/* 3. Docked Bottom Inspection Pane */}
      <ConnectionBottomPane
        connection={selectedConnection}
        onEditProfile={() => {
          if (selectedConnection) {
            setEditConnectionId(selectedConnection.id);
          }
        }}
      />

      {/* 4. Connection Multi-Step Modals */}
      <ConnectionModals
        isCreateOpen={isCreateOpen}
        onCloseCreate={() => setIsCreateOpen(false)}
        onCreate={handleCreate}
        editConnectionId={editConnectionId}
        editConnection={editConnection}
        onCloseEdit={() => setEditConnectionId(null)}
        onUpdate={handleUpdate}
      />
    </div>
  );
}
