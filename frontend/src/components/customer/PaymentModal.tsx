"use client";

import React, { useState } from "react";
import {
  CreditCard,
  QrCode,
  CheckCircle2,
  Copy,
  Upload,
  ArrowRight,
  ShieldCheck,
  Building2,
  Smartphone,
} from "lucide-react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceNo?: string;
  amount?: number;
  onSuccess?: () => void;
}

export function PaymentModal({
  isOpen,
  onClose,
  invoiceNo = "INV-2026-08",
  amount = 3500,
  onSuccess,
}: PaymentModalProps) {
  const toast = useToast();
  const [selectedMethod, setSelectedMethod] = useState<"jazzcash" | "easypaisa" | "1link" | "bank">("jazzcash");
  const [phoneOrId, setPhoneOrId] = useState("03001234567");
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to Clipboard", `${label}: ${text}`);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success(
        "Payment Proof Submitted",
        `Ref ID #${transactionId || "TX-99824"} received. Account status will refresh within 15 minutes.`
      );
      if (onSuccess) onSuccess();
    }, 1200);
  };

  const handleReset = () => {
    setIsSuccess(false);
    setTransactionId("");
    onClose();
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleReset}>
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span className="font-heading font-extrabold text-base">
            Online Bill Payment
          </span>
          <Badge variant="warning" className="font-mono text-xs font-bold">
            PKR {amount.toLocaleString()} Due
          </Badge>
        </DialogTitle>
      </DialogHeader>

      {!isSuccess ? (
        <form onSubmit={handleSubmitPayment} className="space-y-4">
          <DialogContent className="space-y-4">
            {/* Invoice Summary Banner */}
            <div className="flex items-center justify-between rounded-lg border border-border bg-card-subtle p-3 text-xs">
              <div>
                <span className="text-muted-foreground font-mono text-[10px] uppercase block">
                  Invoice Number
                </span>
                <span className="font-mono font-bold text-foreground">
                  {invoiceNo}
                </span>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground font-mono text-[10px] uppercase block">
                  Package Plan
                </span>
                <span className="font-bold text-foreground">
                  Fiber Pro (50 Mbps)
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase">
                Select Payment Channel
              </span>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <button
                  type="button"
                  onClick={() => setSelectedMethod("jazzcash")}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    selectedMethod === "jazzcash"
                      ? "border-primary bg-primary/10 text-primary shadow-xs"
                      : "border-border bg-card hover:bg-card-subtle text-foreground"
                  }`}
                >
                  <Smartphone className="h-4 w-4 mb-1" />
                  <span>JazzCash</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod("easypaisa")}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    selectedMethod === "easypaisa"
                      ? "border-primary bg-primary/10 text-primary shadow-xs"
                      : "border-border bg-card hover:bg-card-subtle text-foreground"
                  }`}
                >
                  <Smartphone className="h-4 w-4 mb-1" />
                  <span>EasyPaisa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod("1link")}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    selectedMethod === "1link"
                      ? "border-primary bg-primary/10 text-primary shadow-xs"
                      : "border-border bg-card hover:bg-card-subtle text-foreground"
                  }`}
                >
                  <CreditCard className="h-4 w-4 mb-1" />
                  <span>1Link / 1Bill</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod("bank")}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                    selectedMethod === "bank"
                      ? "border-primary bg-primary/10 text-primary shadow-xs"
                      : "border-border bg-card hover:bg-card-subtle text-foreground"
                  }`}
                >
                  <Building2 className="h-4 w-4 mb-1" />
                  <span>Bank Raast</span>
                </button>
              </div>
            </div>

            {/* Channel Details Card */}
            {selectedMethod === "jazzcash" && (
              <div className="rounded-lg border border-border bg-card p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-mono">JazzCash Till ID:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-foreground">
                    <span>994821</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy("994821", "JazzCash Till ID")}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Open JazzCash App → Pay Merchant / Till → Enter Till ID <strong>994821</strong> → Pay PKR {amount}.
                </p>
              </div>
            )}

            {selectedMethod === "easypaisa" && (
              <div className="rounded-lg border border-border bg-card p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-mono">EasyPaisa Account:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-foreground">
                    <span>0300 5551101</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy("03005551101", "EasyPaisa Account")}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Title: <strong>Prime Networks (Pvt) Ltd</strong>. Please enter your Subscriber Code <strong>CUS-99482</strong> in the remarks.
                </p>
              </div>
            )}

            {selectedMethod === "1link" && (
              <div className="rounded-lg border border-border bg-card p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-mono">1Bill Consumer Number:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-foreground">
                    <span>10019948201</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy("10019948201", "1Bill Consumer No")}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Pay via any Pakistani ATM, Banking App, or Internet Banking using 1Link / 1Bill Top-Up.
                </p>
              </div>
            )}

            {selectedMethod === "bank" && (
              <div className="rounded-lg border border-border bg-card p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-mono">Raast ID / IBAN:</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-foreground text-[11px]">
                    <span>PK42MEZN009948201</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy("PK42MEZN009948201", "Meezan Bank IBAN")}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Meezan Bank Limited • Account: <strong>Prime Networks Pakistan</strong>
                </p>
              </div>
            )}

            {/* Proof Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Sender Phone / Wallet Number"
                value={phoneOrId}
                onChange={(e) => setPhoneOrId(e.target.value)}
                placeholder="0300xxxxxxx"
                required
              />

              <Input
                label="Transaction ID / TID / Ref #"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g. 88391002"
                required
              />
            </div>
          </DialogContent>

          <DialogFooter className="gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting} className="gap-1.5">
              {isSubmitting ? (
                <span>Verifying with Gateway...</span>
              ) : (
                <>
                  <span>Submit Payment Proof</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      ) : (
        <div className="p-6 text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-extrabold text-foreground">
              Payment Proof Received!
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Your transaction reference has been logged into the ZL Ultra Billing Engine. Your fiber session will automatically refresh upon confirmation.
            </p>
          </div>
          <Button variant="primary" onClick={handleReset} className="w-full">
            Done
          </Button>
        </div>
      )}
    </Dialog>
  );
}
