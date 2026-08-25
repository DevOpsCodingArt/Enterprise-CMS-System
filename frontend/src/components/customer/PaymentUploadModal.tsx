'use client';

import React, { useState } from 'react';
import {
  Receipt,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Building,
  Smartphone,
  X,
  FileText,
} from 'lucide-react';
import { useCustomerPortalStore } from '@/stores/customer-portal-store';
import { mockDb } from '@/mock-db';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export function PaymentUploadModal() {
  const { isPaymentModalOpen, setPaymentModalOpen, submitPaymentProof, customer } =
    useCustomerPortalStore();

  const { showToast } = useToast();

  const [channel, setChannel] = useState('easypaisa');
  const [amount, setAmount] = useState<number>(Number(customer.monthlyBilling) || 3500);
  const [transactionId, setTransactionId] = useState('');
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const channels = mockDb.getPaymentGateways().map((g) => ({
    ...g,
    icon:
      g.id === 'bank_transfer'
        ? Building
        : g.id === 'nayapay'
        ? CreditCard
        : Smartphone,
  }));

  const selectedChannelInfo = channels.find((c) => c.id === channel) || channels[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSampleSlip = () => {
    // Generate sample slip preview for easy testing
    setSlipPreview('https://placehold.co/600x400/0f172a/38bdf8?text=Easypaisa+Payment+Slip+Proof');
    setTransactionId(`EP-${Math.floor(1000000000 + Math.random() * 9000000000)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      showToast('Missing Transaction ID', 'Please enter the transaction reference / TRX ID from your payment slip.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      submitPaymentProof({
        channel: selectedChannelInfo.name,
        amount,
        transactionId: transactionId.trim(),
        slipUrl: slipPreview || '/sample-slip.png',
      });

      setIsSubmitting(false);
      showToast('Payment Slip Submitted', 'Proof sent to Accounts Queue. Your connection balance will update once verified.', 'success');
      setSlipPreview(null);
      setTransactionId('');
    }, 700);
  };

  return (
    <Modal
      isOpen={isPaymentModalOpen}
      onClose={() => setPaymentModalOpen(false)}
      title="Upload Recharge / Bill Payment Proof"
      subtitle="Submit your bank or mobile wallet transfer receipt for rapid invoice clearance."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Select Payment Gateway */}
        <div className="space-y-2">
          <label className="block font-heading font-semibold text-xs text-foreground">
            1. Select Official Payment Method
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {channels.map((c) => {
              const Icon = c.icon;
              const isSelected = channel === c.id;
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setChannel(c.id)}
                  className={`p-3 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-xs ring-1 ring-primary'
                      : 'bg-card border-border hover:border-primary/40 hover:bg-muted/40'
                  }`}
                >
                  <div
                    className={`p-2 rounded-md ${
                      isSelected ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-heading font-semibold text-xs text-foreground">
                      {c.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      {c.accountNumber}
                    </div>
                    <div className="text-[9px] text-muted-foreground">{c.title}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Transfer Instruction Box */}
        <div className="p-3 bg-muted/40 rounded-lg border border-border text-xs space-y-1">
          <div className="font-semibold text-foreground flex items-center justify-between">
            <span>Transfer Destination: {selectedChannelInfo.name}</span>
            <Badge variant="primary" size="xs">
              Verified Merchant
            </Badge>
          </div>
          <div className="font-mono text-primary font-bold text-sm">
            {selectedChannelInfo.accountNumber}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Account Title: <span className="font-medium text-foreground">{selectedChannelInfo.title}</span>
          </div>
        </div>

        {/* Step 2: Form Inputs (Amount & TRX ID) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Input
              label="Paid Amount (PKR)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
            <p className="mt-1 text-[11px] text-muted-foreground">Monthly Package: PKR 3,500</p>
          </div>

          <div>
            <Input
              label="Transaction / TRX ID"
              placeholder="e.g. 9812401928"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
            />
            <p className="mt-1 text-[11px] text-muted-foreground">Exact transaction ID from SMS / app slip</p>
          </div>
        </div>

        {/* Step 3: Slip Screenshot Uploader */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block font-heading font-semibold text-xs text-foreground">
              2. Attach Payment Screenshot / Slip
            </label>
            <button
              type="button"
              onClick={handleSampleSlip}
              className="text-[11px] text-primary hover:underline font-medium"
            >
              + Auto-fill Demo Slip
            </button>
          </div>

          {slipPreview ? (
            <div className="relative border border-border rounded-lg p-2 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded bg-muted flex items-center justify-center overflow-hidden border border-border">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">
                    Payment_Proof_Slip.png
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ Attached ready for verification
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setSlipPreview(null)}
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-border hover:border-primary/60 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-card hover:bg-muted/20 transition-colors">
              <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
              <div className="text-xs font-medium text-foreground">
                Click to upload payment screenshot
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                PNG, JPG, or PDF up to 10MB
              </div>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPaymentModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            leftIcon={<Receipt className="w-3.5 h-3.5" />}
          >
            Submit Payment Proof
          </Button>
        </div>
      </form>
    </Modal>
  );
}
