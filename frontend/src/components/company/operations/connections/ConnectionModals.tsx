"use client";

import React, { useState } from "react";
import { X, ArrowRight, ArrowLeft, Save, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectionRecordItem } from "./ConnectionsTable";
import { useToast } from "@/components/ui/toast";

const steps = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Customer" },
  { id: 3, label: "Services" },
  { id: 4, label: "Accounts" },
  { id: 5, label: "Assignment" },
];

const packagesList = [
  "5 Mbps",
  "6 Mbps",
  "7 Mbps",
  "8 Mbps",
  "10 Mbps",
  "11 Mbps",
  "16 Mbps",
  "20 Mbps",
  "21 Mbps",
  "25 Mbps",
  "40 Mbps",
  "50 Mbps",
];

interface FormState {
  srNo: string;
  date: string;
  installationDate: string;
  ettr: string;
  ticketNo: string;
  name: string;
  fatherName: string;
  mobile: string;
  cnic: string;
  address: string;
  username: string;
  userId: string;
  area: string;
  subArea: string;
  deviceModel: string;
  macAddress: string;
  opticalSignal: string;
  connectionType: string;
  fiberWire: number;
  adapter: string;
  onu: string;
  package: string;
  otc: number;
  monthlyBill: number;
  otcPaid: number;
  monthlyBillPaid: number;
  extraCable: number;
  discountAmount: number;
  refundedAmount: number;
  status: ConnectionRecordItem["status"];
  assignedTo: string;
  assignedBy: string;
  remarks: string;
}

function ConnectionWizardForm({
  initialData,
  isEdit,
  onClose,
  onSubmit,
}: {
  initialData: FormState;
  isEdit: boolean;
  onClose: () => void;
  onSubmit: (data: FormState) => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<FormState>(initialData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const inputClass =
    "w-full px-3 py-2 bg-background border border-border rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm placeholder:text-muted-foreground/50";
  const labelClass =
    "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block";

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 30 : -30,
      opacity: 0,
      transition: { duration: 0.2 },
    }),
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-all duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <div className="bg-card w-full max-w-4xl max-h-[90vh] rounded-xl shadow-xl flex flex-col border border-border pointer-events-auto overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-border flex items-center justify-between shrink-0 bg-muted/5 relative z-10">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                {isEdit ? "Edit Connection" : "New Connection"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Provision and configure a network link
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper */}
          <div className="px-8 py-6 flex justify-between shrink-0 relative border-b border-border bg-card">
            <div className="absolute top-[40px] left-[10%] right-[10%] h-[2px] bg-border z-0">
              <div
                className="h-full bg-success transition-all duration-500 ease-in-out"
                style={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
              />
            </div>

            {steps.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center gap-2 relative z-10 w-24"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors duration-300 bg-card ${
                      isActive
                        ? "border-primary text-primary shadow-[0_0_0_4px_rgba(var(--primary),0.1)]"
                        : isCompleted
                        ? "border-success bg-success text-success-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-bold transition-colors duration-300 ${
                      isActive
                        ? "text-primary"
                        : isCompleted
                        ? "text-success"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Form Content Area */}
          <div className="flex-1 overflow-y-auto px-8 py-6 bg-muted/10 custom-scrollbar relative overflow-x-hidden">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-6">
                      <div className="space-y-1">
                        <label className={labelClass}>SR No</label>
                        <input
                          readOnly
                          value={formData.srNo}
                          className={`${inputClass} bg-muted/50 font-mono text-muted-foreground`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Date *</label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Installation Date *</label>
                        <input
                          type="date"
                          name="installationDate"
                          value={formData.installationDate}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>ETTR *</label>
                        <input
                          type="datetime-local"
                          name="ettr"
                          value={formData.ettr}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Ticket No *</label>
                        <input
                          readOnly
                          value={formData.ticketNo}
                          className={`${inputClass} bg-muted/50 font-mono text-muted-foreground`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Customer */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-6">
                      <div className="space-y-1">
                        <label className={labelClass}>Customer Name *</label>
                        <input
                          name="name"
                          placeholder="E.g. Dr. Bilal Qureshi"
                          value={formData.name}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Father Name</label>
                        <input
                          name="fatherName"
                          placeholder="Optional"
                          value={formData.fatherName}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Mobile No *</label>
                        <input
                          placeholder="+92 300 1234567"
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          className={`${inputClass} font-mono`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>CNIC No *</label>
                        <input
                          placeholder="37405-1234567-1"
                          name="cnic"
                          value={formData.cnic}
                          onChange={handleChange}
                          className={`${inputClass} font-mono`}
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className={labelClass}>Complete Address</label>
                        <textarea
                          name="address"
                          placeholder="Enter physical installation address..."
                          value={formData.address}
                          onChange={handleChange}
                          rows={3}
                          className={`${inputClass} resize-none`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Services */}
                {currentStep === 3 && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-6">
                      <div className="space-y-1">
                        <label className={labelClass}>Username</label>
                        <input
                          name="username"
                          placeholder="PPPoE Username"
                          value={formData.username}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>User ID</label>
                        <input
                          name="userId"
                          placeholder="System ID"
                          value={formData.userId}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Area</label>
                        <select
                          name="area"
                          value={formData.area}
                          onChange={handleChange}
                          className={inputClass}
                        >
                          <option value="">Select Area</option>
                          <option value="Islamabad Core (F-10 HQ)">Islamabad Core (F-10 HQ)</option>
                          <option value="Sector F-7 Islamabad">Sector F-7 Islamabad</option>
                          <option value="Sector F-8 Islamabad">Sector F-8 Islamabad</option>
                          <option value="Sector G-11 Islamabad">Sector G-11 Islamabad</option>
                          <option value="Bahria Enclave Sector C">Bahria Enclave Sector C</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Device Model</label>
                        <input
                          name="deviceModel"
                          placeholder="E.g. Huawei HG8145V5"
                          value={formData.deviceModel}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>MAC Address</label>
                        <input
                          name="macAddress"
                          placeholder="AA:BB:CC:DD:EE:FF"
                          value={formData.macAddress}
                          onChange={handleChange}
                          className={`${inputClass} font-mono uppercase`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Optical Signal</label>
                        <input
                          name="opticalSignal"
                          placeholder="-14dBm"
                          value={formData.opticalSignal}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Connection Type</label>
                        <div className="flex bg-muted/50 p-1 rounded-md border border-border">
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, connectionType: "Fiber" })
                            }
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-sm transition-all cursor-pointer ${
                              formData.connectionType === "Fiber"
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Fiber
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, connectionType: "Wireless" })
                            }
                            className={`flex-1 py-1.5 text-xs font-semibold rounded-sm transition-all cursor-pointer ${
                              formData.connectionType === "Wireless"
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Wireless
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Fiber Wire (m)</label>
                        <input
                          type="number"
                          name="fiberWire"
                          value={formData.fiberWire}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Hardware Included</label>
                        <div className="flex gap-4 pt-2">
                          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.adapter === "Yes"}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  adapter: e.target.checked ? "Yes" : "No",
                                })
                              }
                              className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary"
                            />
                            Adapter
                          </label>
                          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.onu === "Yes"}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  onu: e.target.checked ? "Yes" : "No",
                                })
                              }
                              className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary"
                            />
                            ONU Device
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Speed Package *</label>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {packagesList.map((pkg) => (
                          <button
                            key={pkg}
                            type="button"
                            onClick={() => setFormData({ ...formData, package: pkg })}
                            className={`py-2 px-2 text-xs font-semibold rounded-md transition-all border cursor-pointer ${
                              formData.package === pkg
                                ? "bg-primary/10 text-primary border-primary shadow-sm"
                                : "bg-background text-foreground border-border hover:bg-muted/50"
                            }`}
                          >
                            {pkg}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Accounts */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-5 gap-y-6">
                      <div className="space-y-1">
                        <label className={labelClass}>OTC (Setup Fee) *</label>
                        <input
                          type="number"
                          name="otc"
                          value={formData.otc}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Monthly Bill *</label>
                        <input
                          type="number"
                          name="monthlyBill"
                          value={formData.monthlyBill}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1 bg-primary/5 rounded-md border border-primary/20 p-3">
                        <label className={labelClass}>Total Amount</label>
                        <input
                          readOnly
                          value={`Rs. ${Number(formData.otc) + Number(formData.monthlyBill)}`}
                          className="w-full bg-transparent text-foreground font-bold text-base border-none outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>OTC Paid</label>
                        <input
                          type="number"
                          name="otcPaid"
                          value={formData.otcPaid}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Monthly Bill Paid</label>
                        <input
                          type="number"
                          name="monthlyBillPaid"
                          value={formData.monthlyBillPaid}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1 bg-success/5 rounded-md border border-success/20 p-3">
                        <label className={labelClass}>Amount Paid</label>
                        <input
                          readOnly
                          value={`Rs. ${
                            Number(formData.otcPaid) + Number(formData.monthlyBillPaid)
                          }`}
                          className="w-full bg-transparent text-success font-bold text-base border-none outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={labelClass}>Extra Cable Charges</label>
                        <input
                          type="number"
                          name="extraCable"
                          value={formData.extraCable}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Discount</label>
                        <input
                          type="number"
                          name="discountAmount"
                          value={formData.discountAmount}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-1 bg-destructive/5 rounded-md border border-destructive/20 p-3">
                        <label className={labelClass}>Remaining Balance</label>
                        <input
                          readOnly
                          value={`Rs. ${
                            Number(formData.otc) +
                            Number(formData.monthlyBill) -
                            (Number(formData.otcPaid) + Number(formData.monthlyBillPaid))
                          }`}
                          className="w-full bg-transparent text-destructive font-bold text-base border-none outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1 md:col-span-3 lg:col-span-1">
                        <label className={labelClass}>Account Status *</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className={`${inputClass} font-semibold ${
                            formData.status === "Active"
                              ? "text-success"
                              : formData.status === "Pending"
                              ? "text-warning"
                              : "text-muted-foreground"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Assignment */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-6">
                      <div className="space-y-1">
                        <label className={labelClass}>Assigned Tech *</label>
                        <select
                          name="assignedTo"
                          value={formData.assignedTo}
                          onChange={handleChange}
                          className={inputClass}
                        >
                          <option value="">Select Technician...</option>
                          <option value="Usman Ali (Van #04)">Usman Ali (Van #04)</option>
                          <option value="Bilal Hassan (Technician)">Bilal Hassan (Technician)</option>
                          <option value="Imran Splicer (Drop Team)">Imran Splicer (Drop Team)</option>
                          <option value="Farhan NOC (Remote Desk)">Farhan NOC (Remote Desk)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className={labelClass}>Assigned By</label>
                        <input
                          readOnly
                          value={formData.assignedBy}
                          className={`${inputClass} bg-muted/50 text-muted-foreground`}
                        />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <label className={labelClass}>Installation Remarks</label>
                        <textarea
                          name="remarks"
                          placeholder="Add any special instructions or field notes..."
                          value={formData.remarks}
                          onChange={handleChange}
                          rows={4}
                          className={`${inputClass} resize-none`}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-border flex justify-between shrink-0 bg-muted/5 relative z-10">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
                currentStep === 1
                  ? "opacity-0 pointer-events-none"
                  : "text-foreground hover:bg-muted border border-border bg-card shadow-sm"
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Cancel
              </button>

              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-5 py-2 text-sm bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSubmit(formData)}
                  className="flex items-center gap-1.5 px-5 py-2 text-sm bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Connection
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ConnectionModals({
  isCreateOpen,
  onCloseCreate,
  onCreate,
  editConnectionId,
  editConnection,
  onCloseEdit,
  onUpdate,
}: {
  isCreateOpen: boolean;
  onCloseCreate: () => void;
  onCreate: (conn: ConnectionRecordItem) => void;
  editConnectionId: string | null;
  editConnection: ConnectionRecordItem | null;
  onCloseEdit: () => void;
  onUpdate: (id: string, updates: Partial<ConnectionRecordItem>) => void;
}) {
  const toast = useToast();

  if (!isCreateOpen && !editConnectionId) return null;

  const initialData: FormState = editConnectionId && editConnection
    ? {
        srNo: editConnection.id,
        date: editConnection.date?.substring(0, 10) || "",
        installationDate: editConnection.installationDate?.substring(0, 10) || "",
        ettr: editConnection.ettr?.substring(0, 16) || "",
        ticketNo: editConnection.ticketNo || "TKT-PENDING",
        name: editConnection.customer.name || "",
        fatherName: editConnection.customer.fatherName || "",
        mobile: editConnection.customer.mobile || "",
        cnic: editConnection.customer.cnic || "",
        address: editConnection.customer.address || "",
        username: editConnection.services.username || "",
        userId: editConnection.services.userId || "",
        area: editConnection.services.area || "",
        subArea: "",
        deviceModel: editConnection.services.device || "",
        macAddress: editConnection.services.macAddress || "",
        opticalSignal: editConnection.services.opticalSignal || "",
        connectionType: editConnection.services.connectionType || "Fiber",
        fiberWire: Number(editConnection.services.fiberWire?.replace("m", "")) || 0,
        adapter: editConnection.services.adapter || "Yes",
        onu: editConnection.services.onu || "Yes",
        package: editConnection.services.package || "10 Mbps",
        otc: editConnection.accounts.otc || 0,
        monthlyBill: editConnection.accounts.monthlyBill || 0,
        otcPaid: editConnection.accounts.otcPaid || 0,
        monthlyBillPaid: editConnection.accounts.monthlyBillPaid || 0,
        extraCable: editConnection.accounts.extraCable || 0,
        discountAmount: editConnection.accounts.discount || 0,
        refundedAmount: 0,
        status: editConnection.status || "Pending",
        assignedTo: editConnection.assignment.assignedTo || "",
        assignedBy: editConnection.assignment.assignedBy || "Admin",
        remarks: editConnection.assignment.remarks || "",
      }
    : {
        srNo: "PN-2026-0499",
        date: "2026-08-27",
        installationDate: "",
        ettr: "",
        ticketNo: "TKT-99482100",
        name: "",
        fatherName: "",
        mobile: "",
        cnic: "",
        address: "",
        username: "",
        userId: "",
        area: "",
        subArea: "",
        deviceModel: "Huawei HG8145V5 Dual-Band",
        macAddress: "",
        opticalSignal: "-14dBm",
        connectionType: "Fiber",
        fiberWire: 65,
        adapter: "Yes",
        onu: "Yes",
        package: "10 Mbps",
        otc: 5000,
        monthlyBill: 3500,
        otcPaid: 5000,
        monthlyBillPaid: 0,
        extraCable: 0,
        discountAmount: 0,
        refundedAmount: 0,
        status: "Pending",
        assignedTo: "Usman Ali (Van #04)",
        assignedBy: "Admin",
        remarks: "",
      };

  const handleFormSubmit = (data: FormState) => {
    const updatedPayload: Partial<ConnectionRecordItem> = {
      status: data.status,
      date: data.date,
      installationDate: data.installationDate,
      ettr: data.ettr,
      ticketNo: data.ticketNo,
      customer: {
        name: data.name || "Customer Lead",
        fatherName: data.fatherName,
        mobile: data.mobile || "+92 300 0000000",
        cnic: data.cnic || "37405-0000000-0",
        address: data.address || "Islamabad",
      },
      services: {
        username: data.username,
        userId: data.userId,
        area: data.area || "Islamabad Core (F-10 HQ)",
        package: data.package,
        connectionType: data.connectionType,
        device: data.deviceModel,
        macAddress: data.macAddress,
        opticalSignal: data.opticalSignal,
        fiberWire: `${data.fiberWire}m`,
        adapter: data.adapter,
        onu: data.onu,
      },
      accounts: {
        otc: Number(data.otc),
        monthlyBill: Number(data.monthlyBill),
        otcPaid: Number(data.otcPaid),
        monthlyBillPaid: Number(data.monthlyBillPaid),
        extraCable: Number(data.extraCable),
        discount: Number(data.discountAmount),
        totalAmount: Number(data.otc) + Number(data.monthlyBill),
      },
      assignment: {
        assignedTo: data.assignedTo || "Unassigned",
        assignedBy: data.assignedBy || "Admin",
        remarks: data.remarks,
        diagnostics: {
          signalStrength: data.opticalSignal || "-14.2 dBm",
          dataUsage: "0 GB",
        },
      },
    };

    if (editConnectionId) {
      onUpdate(editConnectionId, updatedPayload);
      toast.success("Updated", "Connection updated successfully.");
      onCloseEdit();
    } else {
      const fullRecord: ConnectionRecordItem = {
        id: data.srNo,
        date: data.date || new Date().toISOString().substring(0, 10),
        status: data.status,
        customer: updatedPayload.customer!,
        services: updatedPayload.services!,
        accounts: updatedPayload.accounts!,
        assignment: updatedPayload.assignment!,
      };
      onCreate(fullRecord);
      toast.success("Created", "New connection created.");
      onCloseCreate();
    }
  };

  return (
    <ConnectionWizardForm
      key={editConnectionId || (isCreateOpen ? "create" : "closed")}
      initialData={initialData}
      isEdit={!!editConnectionId}
      onClose={isCreateOpen ? onCloseCreate : onCloseEdit}
      onSubmit={handleFormSubmit}
    />
  );
}
