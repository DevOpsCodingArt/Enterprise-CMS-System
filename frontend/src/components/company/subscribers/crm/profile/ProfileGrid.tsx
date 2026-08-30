"use client";

import React from "react";
import {
  User,
  Building,
  Network,
  Radio,
  Settings,
  PieChart,
  Cpu,
} from "lucide-react";
import { SubscriberRecord } from "@/mock/db";

function DataField({
  label,
  value,
  renderValue,
  mono = false,
}: {
  label: string;
  value?: string | number | null;
  renderValue?: () => React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-border/40 last:border-0 text-xs">
      <span className="text-muted-foreground font-mono text-[11px] uppercase tracking-wider font-bold">
        {label}
      </span>
      {renderValue ? (
        renderValue()
      ) : (
        <span
          className={`font-semibold text-foreground ${
            mono ? "font-mono text-xs" : ""
          }`}
        >
          {value || "--"}
        </span>
      )}
    </div>
  );
}

function DataCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string; size?: number }>;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 rounded-xl bg-card border border-border space-y-3 shadow-xs hover:border-primary/40 transition-colors">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        {Icon && <Icon size={16} className="text-primary" />}
        <h3 className="font-heading font-bold text-xs uppercase tracking-wider text-foreground">
          {title}
        </h3>
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

export function ProfileGrid({ subscriber }: { subscriber: SubscriberRecord }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* 1. Personal Information */}
      <DataCard title="Personal Information" icon={User}>
        <DataField label="Full Name" value={subscriber.fullName} />
        <DataField label="Username" value={subscriber.pppoeUsername} mono />
        <DataField label="National ID / CNIC" value={subscriber.cnic} mono />
        <DataField label="Mobile Phone" value={subscriber.phone} mono />
        <DataField label="Email Address" value={subscriber.email} />
        <DataField label="Street Address" value={subscriber.address} />
        <DataField label="Sector / Area" value="Sector F-10" />
        <DataField label="City" value="Islamabad" />
        <DataField label="Country" value="Pakistan" />
      </DataCard>

      {/* 2. Company Information */}
      <DataCard title="Company Information" icon={Building}>
        <DataField label="ISP Tenant" value="Prime One Networks" />
        <DataField label="Branch Office" value={subscriber.branchName} />
        <DataField label="Assigned Salesperson" value="Ali NOC Lead" />
        <DataField label="Provisioned On" value={subscriber.installedAt || "2025-06-14"} mono />
      </DataCard>

      {/* 3. Connection Information */}
      <DataCard title="Connection Information" icon={Network}>
        <DataField
          label="Profile Status"
          renderValue={() => (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-success/10 text-success border border-success/20">
              ACTIVE
            </span>
          )}
        />
        <DataField label="Connection Medium" value="FTTH GPON Drop" />
        <DataField
          label="Session State"
          renderValue={() => (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-success/10 text-success border border-success/20">
              ONLINE
            </span>
          )}
        />
        <DataField label="Framed IP" value={subscriber.staticIp || "103.14.22.84"} mono />
        <DataField label="Hardware MAC" value={subscriber.macAddress || "48:57:02:9B:2F:10"} mono />
        <DataField label="Router Model" value="Huawei EchoLife HG8145V5" />
        <DataField label="Last Radius Login" value="Today at 08:30 AM" mono />
        <DataField label="NAS Server" value="ISB-F10-CCR2004-CORE" mono />
      </DataCard>

      {/* 4. Package Information */}
      <DataCard title="Package Information" icon={Radio}>
        <DataField label="Tariff Package" value={subscriber.packageName} />
        <DataField label="Expiration Date" value="Sep 01, 2026" mono />
        <DataField label="Billing Duration" value="30 Days Recurring" />
        <DataField label="Bandwidth Policy" value="50 Mbps Symmetric CIR" />
        <DataField label="Package Pool" value="pool_residential_dhcp" mono />
        <DataField label="Monthly Bill" value={`Rs. ${subscriber.monthlyFeePkr.toLocaleString()}`} mono />
        <DataField label="Billing Due Day" value={`Day ${subscriber.billingDueDay} of month`} mono />
      </DataCard>

      {/* 5. Service Settings */}
      <DataCard title="Service Settings" icon={Settings}>
        <DataField
          label="SMS Notifications"
          renderValue={() => (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20">
              Enabled
            </span>
          )}
        />
        <DataField
          label="Email Statements"
          renderValue={() => (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20">
              Enabled
            </span>
          )}
        />
        <DataField
          label="Auto MAC Lock"
          renderValue={() => (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20">
              Enabled
            </span>
          )}
        />
        <DataField
          label="Auto Renew Policy"
          renderValue={() => (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/10 text-success border border-success/20">
              Enabled
            </span>
          )}
        />
        <DataField
          label="Lock Session"
          renderValue={() => (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground border border-border">
              Disabled
            </span>
          )}
        />
      </DataCard>

      {/* 6. Discount and Quota */}
      <DataCard title="Discount and Quota" icon={PieChart}>
        <DataField label="Used Session Time" value="28d 14h 22m" mono />
        <DataField label="Total Data Quota" value="Unlimited FTTH (1000 GB FUP)" mono />
        <DataField label="Used Data Volume" value="342 GB (Down: 294 GB, Up: 48 GB)" mono />
        <DataField label="Remaining Volume" value="658 GB FUP Remaining" mono />
      </DataCard>

      {/* 7. Technical Details */}
      <DataCard title="Technical OLT Details" icon={Cpu}>
        <DataField label="Core OLT Hostname" value={subscriber.oltHostname} mono />
        <DataField label="GPON Slot / Port" value={subscriber.oltSlotPort} mono />
        <DataField label="FAT Distribution Box" value={subscriber.fatBoxNumber} mono />
        <DataField label="Modem Serial Number" value={subscriber.onuSerial} mono />
        <DataField
          label="Optical Rx Power"
          renderValue={() => (
            <span className="font-mono font-bold text-success">
              {subscriber.opticalRxDbm || -18.4} dBm
            </span>
          )}
        />
        <DataField label="Framed Protocol" value="PPP (PPPoE Encapsulation)" mono />
        <DataField label="Leased IPv6 Prefix" value="2001:db8:85a3::/64" mono />
      </DataCard>
    </div>
  );
}
