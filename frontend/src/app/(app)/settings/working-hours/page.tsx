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
    'Salam! Our support helpdesk is currently offline outside scheduled working hours. Your inquiry has been queued with High Priority, and our on-duty NOC engineer will respond as soon as our shift starts. For emergency link down issues, please call our 24/7 Helpline: +92 51 111-PRIME.'
  );

  const handleToggleDay = (idx: number) => {
    const updated = [...schedule];
    updated[idx].isWorking = !updated[idx].isWorking;
    setSchedule(updated);
  };

  const handleSave = () => {
    showToast('Schedule Saved', 'Working hours and auto-reply policy synced.', 'success');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b-2 border-border">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h1 className="font-heading font-black text-2xl tracking-tight uppercase">
              SUPPORT WORKING HOURS & OUT-OF-OFFICE AUTO-REPLY
            </h1>
          </div>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Configure live helpdesk availability and automatic customer auto-responders outside shift hours.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          leftIcon={<Save className="w-3.5 h-3.5" />}
        >
          SAVE SCHEDULE
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Schedule Table (7 cols) */}
        <div className="md:col-span-7 bg-card border-2 border-border p-5 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-border font-mono text-xs">
            <span className="font-bold uppercase">WEEKLY SHIFT SCHEDULE</span>
            <Badge variant="primary" size="xs">
              7 DAYS ACTIVE
            </Badge>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {schedule.map((item, idx) => (
              <div
                key={item.day}
                className="p-3 bg-card-subtle border border-border flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.isWorking}
                    onChange={() => handleToggleDay(idx)}
                    className="w-4 h-4 accent-primary cursor-pointer"
                  />
                  <span className={item.isWorking ? 'font-bold' : 'text-muted-foreground line-through'}>
                    {item.day}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={item.start}
                    disabled={!item.isWorking}
                    className="bg-card border border-border px-2 py-1 text-xs font-mono disabled:opacity-40"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={item.end}
                    disabled={!item.isWorking}
                    className="bg-card border border-border px-2 py-1 text-xs font-mono disabled:opacity-40"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Automated Out of Office Response (5 cols) */}
        <div className="md:col-span-5 bg-card border-2 border-border p-5 shadow-md space-y-4 font-mono text-xs">
          <div className="pb-3 border-b-2 border-border font-bold uppercase flex items-center justify-between">
            <span>OUT-OF-OFFICE AUTO-REPLY</span>
            <Badge variant="warning" size="xs">
              AUTOMATED
            </Badge>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            When a customer sends a message outside the active shift hours, this response will be automatically dispatched to their chat stream immediately.
          </p>

          <Textarea
            label="AUTOMATED MESSAGE CONTENT"
            value={offlineMessage}
            onChange={(e) => setOfflineMessage(e.target.value)}
            className="min-h-[140px]"
          />
        </div>
      </div>
    </div>
  );
}
