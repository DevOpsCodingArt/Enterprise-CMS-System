'use client';

import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  Smartphone,
  MapPin,
  Mail,
  QrCode,
  HardDrive,
  Wifi,
  Bell,
  Globe,
  Sliders,
  CheckCircle2,
  Lock,
  Save,
} from 'lucide-react';
import { useCustomerPortalStore } from '@/stores/customer-portal-store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export default function CustomerProfilePage() {
  const { customer } = useCustomerPortalStore();

  const { showToast } = useToast();

  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);

  // Wi-Fi Password Change simulation
  const [wifiSsid, setWifiSsid] = useState('Prime_Fiber_Ali_5G');
  const [wifiPassword, setWifiPassword] = useState('fiber123456');

  const handleSaveWifi = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('TR-069 Remote Sync Sent', 'Wi-Fi configuration pushed to your ONU router. Router will apply in 15 seconds.', 'success');
  };

  const handleSavePreferences = () => {
    showToast('Preferences Saved', 'Notification channels updated successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <User className="w-5 h-5" />
          </div>
          <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground">
            Subscriber Account & Hardware Assets
          </h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Review subscriber registration data, assigned optical equipment QR registry, and TR-069 Wi-Fi controls.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Personal Identity & Contact (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity & Account Card */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Verified Subscriber Information
              </div>
              <Badge variant="primary" size="xs">
                Active KYC ✓
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground font-semibold uppercase">
                  Full Name
                </div>
                <div className="font-heading font-bold text-foreground text-sm mt-0.5">
                  {customer.fullName}
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground font-semibold uppercase">
                  Customer Code
                </div>
                <div className="font-mono font-bold text-primary text-sm mt-0.5">
                  {customer.customerCode}
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground font-semibold uppercase">
                  CNIC Number
                </div>
                <div className="font-mono text-foreground font-medium mt-0.5">
                  {customer.cnic || '61101-1234567-1'}
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground font-semibold uppercase">
                  PPPoE Dial-up Username
                </div>
                <div className="font-mono text-foreground font-medium mt-0.5">
                  {customer.username || 'ali.fiber50'}
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground font-semibold uppercase">
                  Primary Mobile Phone
                </div>
                <div className="font-mono text-foreground font-medium mt-0.5">
                  {customer.phone}
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <div className="text-xs text-muted-foreground font-semibold uppercase">
                  Email Address
                </div>
                <div className="font-mono text-foreground font-medium mt-0.5 truncate">
                  {customer.email || 'ali.hassan@gmail.com'}
                </div>
              </div>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg border border-border text-xs space-y-1">
              <div className="text-xs text-muted-foreground font-semibold uppercase flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" /> Installation Premises Address
              </div>
              <div className="font-medium text-foreground">
                {customer.address} · {customer.city}
              </div>
              <div className="text-xs text-muted-foreground font-mono">
                GPS: {customer.latitude || '33.6934'}, {customer.longitude || '73.0112'}
              </div>
            </div>
          </div>

          {/* TR-069 Wi-Fi Remote Management Card */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
                <Wifi className="w-4 h-4 text-primary" />
                Wi-Fi Network Configuration (TR-069 Remote)
              </div>
              <Badge variant="primary" size="xs">
                Auto Push
              </Badge>
            </div>

            <form onSubmit={handleSaveWifi} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Input
                    label="Wi-Fi Network Name (SSID)"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Broadcasted across 2.4G & 5G dual-band</p>
                </div>
                <div>
                  <Input
                    label="Wi-Fi Encryption Password"
                    type="password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    required
                  />
                  <p className="mt-1 text-xs text-muted-foreground">WPA2-PSK AES Encryption</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  leftIcon={<Save className="w-3.5 h-3.5" />}
                >
                  Update Wi-Fi Credentials
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Hardware Inventory & Preferences (1 col) */}
        <div className="space-y-6">
          {/* Assigned Hardware Asset Card */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-primary" />
                Assigned ONU Hardware
              </div>
              <Badge variant="outline" size="xs">
                QR Audited
              </Badge>
            </div>

            <div className="p-3 bg-muted/40 rounded-xl border border-border space-y-2 text-xs">
              <div>
                <div className="text-xs text-muted-foreground uppercase font-semibold">
                  ONU Optical Router Model
                </div>
                <div className="font-heading font-bold text-foreground mt-0.5">
                  Huawei HG8245H5 (Dual Band GPON)
                </div>
              </div>

              <div className="pt-2 border-t border-border/70">
                <div className="text-xs text-muted-foreground uppercase font-semibold">
                  Hardware Serial Number
                </div>
                <div className="font-mono text-primary font-bold mt-0.5">
                  HWTC-98B2-F104
                </div>
              </div>

              <div className="pt-2 border-t border-border/70">
                <div className="text-xs text-muted-foreground uppercase font-semibold">
                  Assigned Distribution Hub
                </div>
                <div className="font-medium text-foreground mt-0.5">
                  {customer.branch?.name || 'Islamabad F-10 Main Hub'}
                </div>
              </div>
            </div>

            <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 flex items-center gap-3">
              <QrCode className="w-8 h-8 text-primary flex-shrink-0" />
              <div className="text-xs text-muted-foreground leading-tight">
                Scannable equipment barcode registered with Prime Van Fleet warehouse stock.
              </div>
            </div>
          </div>

          {/* Preferences & Notifications Card */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="font-heading font-semibold text-sm text-foreground flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                Alert Preferences
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-muted/30">
                <div>
                  <div className="font-medium text-foreground">WhatsApp Invoice Alerts</div>
                  <div className="text-xs text-muted-foreground">Receive bill and recharge receipts</div>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappAlerts}
                  onChange={(e) => setWhatsappAlerts(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-muted/30">
                <div>
                  <div className="font-medium text-foreground">SMS Outage Notifications</div>
                  <div className="text-xs text-muted-foreground">Emergency fiber cut updates</div>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer p-2 rounded-lg hover:bg-muted/30">
                <div>
                  <div className="font-medium text-foreground">Email PDF Monthly Receipts</div>
                  <div className="text-xs text-muted-foreground">Auto sent on the 1st of every month</div>
                </div>
                <input
                  type="checkbox"
                  checked={emailReceipts}
                  onChange={(e) => setEmailReceipts(e.target.checked)}
                  className="rounded text-primary focus:ring-primary w-4 h-4"
                />
              </label>
            </div>

            <div className="pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleSavePreferences}
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
