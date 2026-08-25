'use client';

import React, { useState } from 'react';
import {
  LifeBuoy,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  HelpCircle,
  Zap,
  ArrowRight,
  Send,
  Wifi,
} from 'lucide-react';
import { useCustomerPortalStore, CustomerTicket } from '@/stores/customer-portal-store';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export function CreateComplaintModal() {
  const { isComplaintModalOpen, setComplaintModalOpen, lodgeComplaint, opticalRxDbm } =
    useCustomerPortalStore();

  const { showToast } = useToast();

  const [step, setStep] = useState<'troubleshoot' | 'form'>('troubleshoot');
  const [rebooting, setRebooting] = useState(false);
  const [rebootDone, setRebootDone] = useState(false);

  // Form State
  const [category, setCategory] = useState<CustomerTicket['category']>('fiber_break');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<CustomerTicket['priority']>('urgent');

  const isSignalCut = opticalRxDbm < -27.5;

  const handleSimulateReboot = () => {
    setRebooting(true);
    setTimeout(() => {
      setRebooting(false);
      setRebootDone(true);
      showToast('ONU Restart Completed', 'Optical link re-initialized. If issue persists, proceed to lodge ticket.', 'info');
    }, 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      showToast('Validation Error', 'Please enter a title and description of the issue.', 'error');
      return;
    }

    lodgeComplaint({
      category,
      title: title.trim(),
      description: description.trim(),
      priority,
    });

    showToast('Complaint Registered', 'Trouble ticket logged. Our Islamabad F-10 field team is notified.', 'success');
    setTitle('');
    setDescription('');
    setStep('troubleshoot');
  };

  return (
    <Modal
      isOpen={isComplaintModalOpen}
      onClose={() => setComplaintModalOpen(false)}
      title="Lodge Support Complaint / Trouble Ticket"
      subtitle="Quick self-diagnostic test and automated field technician dispatch."
      size="lg"
    >
      {step === 'troubleshoot' ? (
        <div className="space-y-4">
          <div className="p-3.5 bg-primary/10 rounded-xl border border-primary/20 flex items-start gap-3">
            <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-heading font-semibold text-foreground">
                Automated Network Telemetry Diagnostic
              </div>
              <div className="text-muted-foreground leading-relaxed">
                Current optical power reading:{' '}
                <span className="font-mono font-bold text-foreground">
                  {opticalRxDbm.toFixed(1)} dBm
                </span>{' '}
                ({isSignalCut ? 'Critical Red LOS' : 'Normal Light Power'}).
              </div>
            </div>
          </div>

          {/* 3 Quick Diagnostic Steps */}
          <div className="space-y-2.5">
            <div className="font-heading font-semibold text-xs text-foreground uppercase tracking-wider">
              Quick Troubleshooting Checklist:
            </div>

            <div className="p-3 bg-muted/30 rounded-lg border border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-muted font-mono font-bold text-[10px] flex items-center justify-center">
                  1
                </span>
                <span>Ensure yellow fiber patch cord is firmly plugged into ONU</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>

            <div className="p-3 bg-muted/30 rounded-lg border border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-muted font-mono font-bold text-[10px] flex items-center justify-center">
                  2
                </span>
                <span>Check if ONU Power LED is solid green and LOS is not red</span>
              </div>
              {isSignalCut ? (
                <Badge variant="destructive" size="xs">
                  Red Light
                </Badge>
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              )}
            </div>

            <div className="p-3 bg-muted/30 rounded-lg border border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded-full bg-muted font-mono font-bold text-[10px] flex items-center justify-center">
                  3
                </span>
                <span>Perform remote router power reboot sweep</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleSimulateReboot}
                isLoading={rebooting}
                leftIcon={<RefreshCw className="w-3 h-3 text-primary" />}
              >
                {rebootDone ? 'Rebooted ✓' : 'Restart ONU'}
              </Button>
            </div>
          </div>

          {/* Continue to Ticket lodging */}
          <div className="pt-3 border-t border-border flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setComplaintModalOpen(false)}
            >
              Issue Resolved, Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                setTitle(
                  isSignalCut
                    ? 'Optical Fiber Loss / Red LOS Blinking'
                    : 'Broadband Disconnection / Slow Speed Issue'
                );
                setStep('form');
              }}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Issue Not Resolved (Lodge Ticket)
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Complaint Category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              options={[
                { value: 'fiber_break', label: 'Fiber Cable Break / Red LOS' },
                { value: 'slow_speed', label: 'Slow Speed / High Latency' },
                { value: 'onu_failure', label: 'ONU / Router Hardware Fault' },
                { value: 'router_config', label: 'Wi-Fi Password / Config' },
                { value: 'relocation', label: 'Premises Shifting Request' },
              ]}
            />

            <Select
              label="Priority Level"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              options={[
                { value: 'urgent', label: 'Urgent (Complete Offline Outage)' },
                { value: 'normal', label: 'Normal (Degraded Speed/Config)' },
                { value: 'low', label: 'Low (General Inquiry)' },
              ]}
            />
          </div>

          <Input
            label="Complaint Subject"
            placeholder="e.g. Red LOS Light on Router since 30 mins"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            label="Detailed Description"
            placeholder="Describe what happened, any physical damage to drop cable, or when the connection went down..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />

          <div className="p-3 bg-muted/40 rounded-lg border border-border text-xs flex items-center justify-between">
            <div className="text-muted-foreground">
              Assigned Field Hub: <span className="font-semibold text-foreground">ISB F-10 (Van 02)</span>
            </div>
            <Badge variant="primary" size="xs">
              Target ETTR: 45m
            </Badge>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setStep('troubleshoot')}
            >
              Back to Checklist
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Submit Trouble Ticket
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
