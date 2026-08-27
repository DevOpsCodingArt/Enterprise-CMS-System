"use client";

import React, { useState } from "react";
import { X, Save, User, Phone, Mail, MapPin, Server, Wifi, Shield } from "lucide-react";
import { SubscriberRecord } from "@/mock/db";
import { useToast } from "@/components/ui/toast";

export function AddSubscriberModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (sub: SubscriberRecord) => void;
}) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    cnic: "",
    phone: "",
    email: "",
    address: "",
    branchName: "Islamabad Core (F-10 HQ)",
    packageName: "50 Mbps Ultra Fiber",
    monthlyFeePkr: 3850,
    pppoeUsername: "",
    macAddress: "",
    onuSerial: "HWTC-9024",
    oltHostname: "Huawei MA5800-X7 (ISB-F10-OLT-01)",
    oltSlotPort: "Slot 0/2 · PON-04",
    fatBoxNumber: "FAT-F10-18 (Port 2)",
    opticalRxDbm: -18.4,
    status: "active" as SubscriberRecord["status"],
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.pppoeUsername) {
      toast.error("Missing Fields", "Please complete all mandatory subscriber fields.");
      return;
    }

    const newSub: SubscriberRecord = {
      id: `cus-${Math.floor(10000 + Math.random() * 90000)}`,
      customerCode: `PK-${Math.floor(10000 + Math.random() * 90000)}`,
      fullName: formData.fullName,
      cnic: formData.cnic || "37405-0000000-0",
      phone: formData.phone,
      whatsapp: formData.phone,
      email: formData.email || "subscriber@domain.pk",
      address: formData.address || "Islamabad, Pakistan",
      geoCoords: "33.6938° N, 73.0135° E",
      branchId: "br-isb-01",
      branchName: formData.branchName,
      packageId: "pkg-50m",
      packageName: formData.packageName,
      monthlyFeePkr: Number(formData.monthlyFeePkr),
      pppoeUsername: formData.pppoeUsername,
      onuSerial: formData.onuSerial,
      macAddress: formData.macAddress || "48:57:02:9B:2F:10",
      oltHostname: formData.oltHostname,
      oltSlotPort: formData.oltSlotPort,
      fatBoxNumber: formData.fatBoxNumber,
      opticalRxDbm: Number(formData.opticalRxDbm),
      opticalStatus: "optimal",
      currentSpeedDownMbps: 50,
      currentSpeedUpMbps: 50,
      ledgerBalancePkr: 0,
      securityDepositPkr: 5000,
      status: formData.status,
      installedAt: new Date().toISOString().substring(0, 10),
      billingDueDay: 1,
    };

    onAdd(newSub);
    toast.success("Subscriber Created", `${newSub.fullName} provisioned successfully.`);
    onClose();
  };

  const inputClass =
    "w-full px-3 py-2 bg-background border border-border rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-xs placeholder:text-muted-foreground/50";
  const labelClass =
    "text-[10.5px] font-mono font-bold text-muted-foreground uppercase tracking-wider mb-1 block";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-xs" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-muted/20">
          <div>
            <h2 className="text-base font-bold text-foreground">Provision New Subscriber</h2>
            <p className="text-xs text-muted-foreground">Add customer CRM profile and provision RADIUS account</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase font-bold text-primary flex items-center gap-1.5 border-b border-border pb-1.5">
              <User className="w-3.5 h-3.5" /> Customer Personal Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Full Name *</label>
                <input
                  name="fullName"
                  placeholder="e.g. Asad Mehmood"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>CNIC / National ID</label>
                <input
                  name="cnic"
                  placeholder="37405-1234567-1"
                  value={formData.cnic}
                  onChange={handleChange}
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div>
                <label className={labelClass}>Phone / Mobile *</label>
                <input
                  name="phone"
                  placeholder="+92 300 1234567"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`${inputClass} font-mono`}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input
                  name="email"
                  type="email"
                  placeholder="subscriber@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Installation Address</label>
                <input
                  name="address"
                  placeholder="House #, Street #, Sector/Area, City"
                  value={formData.address}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-mono uppercase font-bold text-primary flex items-center gap-1.5 border-b border-border pb-1.5">
              <Server className="w-3.5 h-3.5" /> Service & Network Parameters
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>PPPoE Username *</label>
                <input
                  name="pppoeUsername"
                  placeholder="e.g. asad_isb_50m"
                  value={formData.pppoeUsername}
                  onChange={handleChange}
                  className={`${inputClass} font-mono font-bold`}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Tariff Package</label>
                <select
                  name="packageName"
                  value={formData.packageName}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="20 Mbps Home Starter">20 Mbps Home Starter (Rs. 2,450)</option>
                  <option value="50 Mbps Ultra Fiber">50 Mbps Ultra Fiber (Rs. 3,850)</option>
                  <option value="100 Mbps Pro Gamer">100 Mbps Pro Gamer (Rs. 5,950)</option>
                  <option value="1 Gbps Corporate Dedicated">1 Gbps Corporate Dedicated (Rs. 24,000)</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>CPE MAC Address</label>
                <input
                  name="macAddress"
                  placeholder="AA:BB:CC:DD:EE:FF"
                  value={formData.macAddress}
                  onChange={handleChange}
                  className={`${inputClass} font-mono`}
                />
              </div>
              <div>
                <label className={labelClass}>Account Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className={`${inputClass} font-bold text-success`}
                >
                  <option value="active">Active</option>
                  <option value="suspended_unpaid">Suspended (Unpaid)</option>
                  <option value="frozen">Frozen (Temporary)</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save & Provision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
