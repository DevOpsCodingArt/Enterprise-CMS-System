'use client';

import React from 'react';
import {
  Receipt,
  Download,
  UploadCloud,
  CheckCircle2,
  Clock,
  CreditCard,
  Building,
  Smartphone,
  ShieldCheck,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useCustomerPortalStore } from '@/stores/customer-portal-store';
import { mockDb } from '@/mock-db';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatCurrencyPKR } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

export default function CustomerBillsPage() {
  const {
    customer,
    invoices,
    activePaymentProof,
    setPaymentModalOpen,
  } = useCustomerPortalStore();

  const { showToast } = useToast();

  const handleDownloadInvoice = (invNum: string) => {
    showToast('Receipt Generated', `Downloading official invoice receipt ${invNum}.pdf`, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Current Billing Status */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
              Monthly Subscription Plan
            </span>
            <Badge variant="primary" size="xs">
              {customer.packageSpeed}
            </Badge>
          </div>
          <div className="font-heading font-bold text-3xl text-foreground">
            {formatCurrencyPKR(Number(customer.monthlyBilling))}
          </div>
          <p className="text-xs text-muted-foreground">
            Next renewal billing cycle:{' '}
            <span className="font-semibold text-foreground font-mono">
              {customer.billingExpiryDate || '05 Sep 2026'}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={() => setPaymentModalOpen(true)}
            leftIcon={<UploadCloud className="w-4 h-4" />}
          >
            Upload Payment Slip
          </Button>
        </div>
      </div>

      {/* Active Slip Verification Progress (If uploaded) */}
      {activePaymentProof && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary text-primary-foreground">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-heading font-semibold text-xs text-foreground">
                  Payment Proof Under Verification
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  TRX ID: {activePaymentProof.transactionId} · {activePaymentProof.channel}
                </div>
              </div>
            </div>
            <Badge variant="primary" size="xs">
              Pending Clearance
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-lg bg-card border border-border">
              <CheckCircle2 className="w-4 h-4 text-success mx-auto mb-1" />
              <div className="font-semibold text-foreground">1. Slip Uploaded</div>
              <div className="text-xs text-muted-foreground">Received by system</div>
            </div>
            <div className="p-2.5 rounded-lg bg-card border border-primary/40 ring-1 ring-primary/20">
              <Clock className="w-4 h-4 text-primary mx-auto mb-1 animate-spin" />
              <div className="font-semibold text-primary">2. Verification</div>
              <div className="text-xs text-muted-foreground">Accounts ledger check</div>
            </div>
            <div className="p-2.5 rounded-lg bg-card border border-border opacity-60">
              <ShieldCheck className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
              <div className="font-semibold text-foreground">3. Balance Cleared</div>
              <div className="text-xs text-muted-foreground">Auto renewal</div>
            </div>
          </div>
        </div>
      )}

      {/* Official Payment Accounts Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {mockDb.getPaymentGateways().map((g) => (
          <div key={g.id} className="p-3.5 bg-card rounded-xl border border-border shadow-2xs space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase truncate">
              {g.name}
            </div>
            <div className="font-mono font-bold text-xs text-foreground truncate">{g.accountNumber}</div>
            <div className="text-xs text-muted-foreground truncate">{g.title}</div>
          </div>
        ))}
      </div>

      {/* Invoices History Table */}
      <div className="bg-card rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border bg-card flex items-center justify-between">
          <div className="font-heading font-semibold text-sm text-foreground">
            Billing Ledger & Invoices
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {invoices.length} Total Invoices
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead className="bg-muted/30 border-b border-border text-muted-foreground uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Month</th>
                <th className="p-3.5">Amount (PKR)</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Payment Method / TRX</th>
                <th className="p-3.5">Issue / Due Date</th>
                <th className="p-3.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3.5 font-mono font-semibold text-foreground">
                    {inv.invoiceNumber}
                  </td>
                  <td className="p-3.5 font-medium text-foreground">{inv.month}</td>
                  <td className="p-3.5 font-mono font-bold text-foreground">
                    {formatCurrencyPKR(inv.amount)}
                  </td>
                  <td className="p-3.5">
                    <Badge
                      variant={
                        inv.status === 'paid'
                          ? 'primary'
                          : inv.status === 'pending_verification'
                          ? 'warning'
                          : 'destructive'
                      }
                      size="xs"
                    >
                      {inv.status === 'paid'
                        ? 'PAID ✓'
                        : inv.status === 'pending_verification'
                        ? 'VERIFYING'
                        : 'UNPAID'}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-muted-foreground font-mono text-xs">
                    <div>{inv.paymentMethod || '—'}</div>
                    {inv.transactionRef && (
                      <div className="text-xs text-muted-foreground/80">
                        Ref: {inv.transactionRef}
                      </div>
                    )}
                  </td>
                  <td className="p-3.5 text-muted-foreground font-mono text-xs">
                    {inv.issueDate} → {inv.dueDate}
                  </td>
                  <td className="p-3.5 text-right">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleDownloadInvoice(inv.invoiceNumber)}
                      leftIcon={<Download className="w-3 h-3 text-primary" />}
                    >
                      PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
