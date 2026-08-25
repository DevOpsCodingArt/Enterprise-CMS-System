'use client';

import React, { useState } from 'react';
import { Clock, Save, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { mockDb } from '@/mock-db';

export default function WorkingHoursPage() {
  const { showToast } = useToast();

  const [schedule, setSchedule] = useState(
    mockDb.getWorkingHours().map((d) => ({
      day: d.day,
      isWorking: d.isOpen,
      start: d.openTime,
      end: d.closeTime,
    }))
  );

  const [offlineMessage, setOfflineMessage] = useState(
    'Hello! Our support helpdesk is currently offline outside scheduled working hours. Your inquiry has been queued with High Priority, and our on-duty NOC engineer will respond as soon as our shift starts. For emergency link down issues, please call our 24/7 Helpline: +92 51 111-PRIME.'
  );

  const handleToggleDay = (idx: number) => {
    const updated = [...schedule];
    updated[idx].isWorking = !updated[idx].isWorking;
    setSchedule(updated);
  };

  const handleTimeChange = (idx: number, field: 'start' | 'end', value: string) => {
    const updated = [...schedule];
    updated[idx][field] = value;
    setSchedule(updated);
  };

  const handleSave = () => {
    showToast('Schedule Saved', 'Working hours and auto-reply policy synced.', 'success');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Clock className="w-5 h-5" />
            </div>
            <h1 className="font-heading font-bold text-2xl tracking-tight text-foreground">
              Support Working Hours & Auto-Reply
            </h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Configure live helpdesk availability and automatic customer auto-responders outside shift hours.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          leftIcon={<Save className="w-3.5 h-3.5" />}
        >
          Save Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Schedule Table (7 cols) */}
        <div className="md:col-span-7 bg-card rounded-xl border border-border p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border/70 text-xs">
            <span className="font-heading font-semibold text-foreground">Weekly Shift Schedule</span>
            <Badge variant="primary" size="xs">
              7 Days Configured
            </Badge>
          </div>

          <div className="space-y-2 text-xs">
            {schedule.map((item, idx) => (
              <div
                key={item.day}
                className="p-3 rounded-lg bg-muted/30 border border-border/70 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.isWorking}
                    onChange={() => handleToggleDay(idx)}
                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                  />
                  <span className={item.isWorking ? 'font-medium text-foreground' : 'text-muted-foreground line-through'}>
                    {item.day}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <input
                    type="time"
                    value={item.start}
                    onChange={(e) => handleTimeChange(idx, 'start', e.target.value)}
                    disabled={!item.isWorking}
                    className="bg-card rounded-md border border-border px-2 py-1 text-xs font-mono disabled:opacity-40"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="time"
                    value={item.end}
                    onChange={(e) => handleTimeChange(idx, 'end', e.target.value)}
                    disabled={!item.isWorking}
                    className="bg-card rounded-md border border-border px-2 py-1 text-xs font-mono disabled:opacity-40"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Out-of-Office Auto Responder (5 cols) */}
        <div className="md:col-span-5 bg-card rounded-xl border border-border p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-border/70">
            <ShieldAlert className="w-4 h-4 text-warning" />
            <h3 className="font-heading font-semibold text-sm text-foreground">
              Off-Hours Auto-Responder
            </h3>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-muted-foreground leading-relaxed">
              When a subscriber opens a chat outside active hours, this bot auto-response is sent immediately to prevent SLA anxiety.
            </p>

            <Textarea
              label="Automated Out-of-Office Response"
              value={offlineMessage}
              onChange={(e) => setOfflineMessage(e.target.value)}
              rows={6}
            />

            <div className="p-3 rounded-lg bg-warning/10 border border-warning/20 text-xs text-warning-foreground dark:text-warning space-y-1">
              <div className="font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> High-Priority Tagging Active
              </div>
              <div className="text-[11px] opacity-90">
                Off-hour messages are marked with urgent status and sent to the on-duty NOC supervisor.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
