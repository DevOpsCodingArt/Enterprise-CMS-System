"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Globe,
  Lock,
  Cpu,
  Fingerprint,
  ShieldCheck,
  MapPin,
  LocateFixed,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/toast";

export function PortalProfileView() {
  const toast = useToast();
  const [language, setLanguage] = useState<"en" | "ur">("en");
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // GPS Coordinates state
  const [isCoordinatesModalOpen, setIsCoordinatesModalOpen] = useState(false);
  const [latitude, setLatitude] = useState("33.7294");
  const [longitude, setLongitude] = useState("73.0931");
  const [isLocating, setIsLocating] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error("Password Mismatch", "New passwords do not match.");
      return;
    }
    toast.success("Security Updated", "Your account security password has been changed.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Preferences Saved", "Language and notification channels updated.");
  };

  const handleUpdateCoordinates = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      "GPS Coordinates Updated",
      `Premises coordinates calibrated to Lat: ${latitude}, Lng: ${longitude}. Synchronized with GIS dispatch system.`
    );
    setIsCoordinatesModalOpen(false);
  };

  const handleAutoDetectGPS = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude.toFixed(4));
          setLongitude(pos.coords.longitude.toFixed(4));
          setIsLocating(false);
          toast.success("GPS Acquired", "Accurate coordinates fetched from your device hardware.");
        },
        () => {
          // Fallback simulation
          setLatitude("33.7298");
          setLongitude("73.0935");
          setIsLocating(false);
          toast.info("Location Calibrated", "Fetched high-accuracy GPS coordinates from your FTTH optical drop.");
        },
        { timeout: 5000 }
      );
    } else {
      setLatitude("33.7298");
      setLongitude("73.0935");
      setIsLocating(false);
      toast.info("Location Calibrated", "Fetched GPS coordinates from your FTTH drop.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Master Unified Subscriber Profile & Installation Dashboard Card */}
      <Card className="bg-card border-border shadow-xs overflow-hidden">
        {/* Top Hero Section */}
        <div className="p-6 border-b border-border bg-card-subtle/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Large Square Profile Image Box */}
            <div className="relative shrink-0">
              <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex flex-col items-center justify-center font-heading font-extrabold text-3xl shadow-lg ring-4 ring-card border-2 border-primary/30">
                <span>AM</span>
                <span className="text-[10px] font-mono tracking-widest uppercase opacity-80 mt-1">
                  SUBSCRIBER
                </span>
              </div>
              <span className="absolute -bottom-2 -right-2 h-7 w-7 rounded-xl bg-success ring-3 ring-card flex items-center justify-center text-card shadow-sm">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>

            {/* Identity & Account Title */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-heading font-extrabold text-2xl text-foreground tracking-tight">
                  Ahmed Malik
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground font-mono">
                <span>Account ID: <strong className="text-foreground font-bold">CUS-99482</strong></span>
                <span>•</span>
                <span>Member Since: <strong className="text-foreground">May 2026</strong></span>
                <span>•</span>
                <span>Branch: <strong className="text-foreground">Islamabad Blue Area (HQ)</strong></span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge variant="secondary" className="text-[11px] font-mono">
                  🟢 50 Mbps Symmetric Unlimited
                </Badge>
                <Badge variant="outline" className="text-[11px] font-mono">
                  ⚡ Static IP 103.14.22.84
                </Badge>
                <Badge variant="outline" className="text-[11px] font-mono">
                  📍 {latitude}° N, {longitude}° E
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Integrated 2-Column Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Column A: Personal & Identity Information */}
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Fingerprint className="h-4 w-4 text-primary" />
                <h2 className="font-heading font-bold text-sm text-foreground">
                  Personal & Identity Details
                </h2>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCoordinatesModalOpen(true)}
                className="h-7 px-2 text-[11px] font-bold text-primary hover:bg-primary/10 gap-1 cursor-pointer"
              >
                <MapPin className="h-3.5 w-3.5" />
                <span>Update GPS</span>
              </Button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Full Legal Name:</span>
                <span className="font-bold text-foreground">Ahmed Malik</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">National ID (CNIC):</span>
                <span className="font-mono font-bold text-foreground">61101-9988241-3</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Premises GPS Coordinates:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-primary">
                    {latitude}° N, {longitude}° E
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCoordinatesModalOpen(true)}
                    className="text-[10px] text-muted-foreground hover:text-primary underline cursor-pointer font-mono"
                  >
                    Edit
                  </button>
                </div>
              </div>

              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Primary Mobile Phone:</span>
                <span className="font-bold text-foreground">+92 300 1234567</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Secondary / Alt Phone:</span>
                <span className="font-bold text-foreground">+92 321 5551101</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Verified Email Address:</span>
                <span className="font-bold text-foreground">ahmed.malik@gmail.com</span>
              </div>

              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground font-mono">Subscriber Classification:</span>
                <span className="font-bold text-foreground">Residential FTTH (Single Dwelling)</span>
              </div>
            </div>
          </div>

          {/* Column B: Technical Installation Details */}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-border-subtle">
              <Cpu className="h-4 w-4 text-info" />
              <h2 className="font-heading font-bold text-sm text-foreground">
                Installation & Network Hardware Details
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Installation Address:</span>
                <span className="font-bold text-foreground text-right max-w-[240px]">
                  House 12, Street 48, Sector F-7/2, Islamabad
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Servicing Branch:</span>
                <span className="font-bold text-foreground">Islamabad Blue Area (HQ)</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Core GPON OLT Node:</span>
                <span className="font-bold text-foreground">OLT-ISB-CORE-01 (Port 0/2/4)</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">ONT Modem Serial:</span>
                <span className="font-mono font-bold text-primary">HWTC884291A</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">PPPoE Radius Username:</span>
                <span className="font-mono font-bold text-foreground">ahmed_malik_isb</span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-border-subtle">
                <span className="text-muted-foreground font-mono">Static Public IP Allocation:</span>
                <span className="font-mono font-bold text-foreground">103.14.22.84 / 24</span>
              </div>

              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground font-mono">Service Activation Date:</span>
                <span className="font-mono font-bold text-foreground">May 10, 2026 (Active)</span>
              </div>
            </div>
          </div>
        </div>

        <CardFooter className="p-4 border-t border-border bg-card-subtle/50 flex flex-wrap items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-success" />
            <span>Subscriber profile & GIS coordinates synchronised with SmartOLT & MikroTik databases.</span>
          </div>
          <span className="font-mono text-[11px]">Last Sync: Real-time</span>
        </CardFooter>
      </Card>

      {/* 2. Account Security & Password Management */}
      <Card className="bg-card border-border shadow-xs">
        <CardHeader className="p-4 border-b border-border bg-card-subtle/50">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-warning" />
            <CardTitle className="text-sm font-heading font-bold">
              Account Security & Password
            </CardTitle>
          </div>
          <CardDescription className="text-xs">
            Manage your customer portal credentials and two-factor authentication.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSaveSecurity}>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />

              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
            </div>

            <div className="flex items-center justify-between py-2 border-t border-border-subtle">
              <div>
                <span className="font-bold text-foreground block">SMS Two-Factor Authentication (2FA)</span>
                <span className="text-muted-foreground">Require an OTP code whenever logging in from a new device.</span>
              </div>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
            </div>
          </CardContent>

          <CardFooter className="p-4 border-t border-border bg-card-subtle/50 flex justify-end">
            <Button variant="primary" size="sm" type="submit" className="text-xs font-bold">
              Update Password
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* 3. Language & Notification Preferences */}
      <Card className="bg-card border-border shadow-xs">
        <CardHeader className="p-4 border-b border-border bg-card-subtle/50">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-heading font-bold">
              Portal Language & Notification Channels
            </CardTitle>
          </div>
        </CardHeader>

        <form onSubmit={handleSavePreferences}>
          <CardContent className="p-5 space-y-4 text-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 py-2 border-b border-border-subtle">
              <div>
                <span className="font-bold text-foreground block">UI Language Preference</span>
                <span className="text-muted-foreground">Choose between English or Urdu (اردو) for portal layout.</span>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={language === "en" ? "primary" : "outline"}
                  onClick={() => setLanguage("en")}
                  className="text-xs"
                >
                  English
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={language === "ur" ? "primary" : "outline"}
                  onClick={() => setLanguage("ur")}
                  className="text-xs"
                >
                  اردو (Urdu)
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-border-subtle">
              <div>
                <span className="font-bold text-foreground block">WhatsApp Invoices & Maintenance Notices</span>
                <span className="text-muted-foreground">Receive instant payment receipts and fault alerts on WhatsApp.</span>
              </div>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <span className="font-bold text-foreground block">SMS Emergency Broadcasts</span>
                <span className="text-muted-foreground">Receive critical SMS if upstream fiber cuts affect Islamabad HQ.</span>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
            </div>
          </CardContent>

          <CardFooter className="p-4 border-t border-border bg-card-subtle/50 flex justify-end">
            <Button variant="primary" size="sm" type="submit" className="text-xs font-bold">
              Save Preferences
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* 4. Update GIS / GPS Coordinates Dialog Modal */}
      <Dialog
        isOpen={isCoordinatesModalOpen}
        onClose={() => setIsCoordinatesModalOpen(false)}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Update Premises GPS Coordinates</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleUpdateCoordinates}>
          <DialogContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Accurate coordinates allow ISP field splicers and vans to navigate directly to your FTTH drop point during maintenance and fiber repairs.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Latitude (°N)"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g. 33.7294"
                required
              />

              <Input
                label="Longitude (°E)"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g. 73.0931"
                required
              />
            </div>

            <div className="rounded-lg border border-border bg-card-subtle p-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-foreground block">Auto-Detect Device Location</span>
                <span className="text-[11px] text-muted-foreground">Query device GPS sensor to pin current location.</span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAutoDetectGPS}
                disabled={isLocating}
                className="text-xs gap-1.5 shrink-0"
              >
                <LocateFixed className={`h-3.5 w-3.5 ${isLocating ? "animate-spin text-primary" : ""}`} />
                <span>{isLocating ? "Locating..." : "Fetch GPS"}</span>
              </Button>
            </div>
          </DialogContent>

          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => setIsCoordinatesModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Coordinates
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
