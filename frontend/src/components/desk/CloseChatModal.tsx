'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { CheckCircle2, Lock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface CloseChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  onCloseSuccess?: () => void;
}

export const CloseChatModal: React.FC<CloseChatModalProps> = ({
  isOpen,
  onClose,
  conversationId,
  onCloseSuccess,
}) => {
  const [outcome, setOutcome] = useState<'resolved' | 'ticket_created' | 'unreachable' | 'spam'>('resolved');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const outcomes = [
    {
      id: 'resolved',
      label: 'ISSUE RESOLVED (1ST-LEVEL DESK)',
      desc: 'Customer problem solved remotely (router reboot, optical dBm restored, password reset).',
    },
    {
      id: 'ticket_created',
      label: 'ESCALATED TO TROUBLE TICKET',
      desc: 'Physical fiber break or hardware replacement escalated to field engineer dispatch.',
    },
    {
      id: 'unreachable',
      label: 'CUSTOMER UNREACHABLE',
      desc: 'Customer did not respond after 3 consecutive follow-ups.',
    },
    {
      id: 'spam',
      label: 'SPAM / DUPLICATE INQUIRY',
      desc: 'Non-customer message or duplicate interaction session.',
    },
  ];

  const handleClose = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      showToast(
        'Conversation Closed Successfully',
        `Closed with recorded outcome: ${outcome.toUpperCase()}`,
        'success'
      );

      onClose();
      if (onCloseSuccess) onCloseSuccess();
    } catch {
      showToast('Error', 'Failed to close conversation', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CLOSE CONVERSATION // RECORD OUTCOME"
      subtitle="HD-019: Interaction can only be closed with a recorded resolution outcome."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleClose}
            isLoading={isSubmitting}
            leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
          >
            CONFIRM & CLOSE CHAT
          </Button>
        </>
      }
    >
      <div className="space-y-4 font-mono text-xs">
        <div>
          <label className="block text-xs font-bold text-foreground mb-2 uppercase">
            SELECT CLOSURE OUTCOME (MANDATORY)
          </label>
          <div className="space-y-2">
            {outcomes.map((o) => (
              <label
                key={o.id}
                onClick={() => setOutcome(o.id as any)}
                className={`flex items-start gap-3 p-3 border-2 cursor-pointer transition-colors ${
                  outcome === o.id
                    ? 'bg-card border-primary shadow-sm'
                    : 'bg-muted/30 border-border hover:border-primary/50'
                }`}
              >
                <input
                  type="radio"
                  name="closure_outcome"
                  checked={outcome === o.id}
                  onChange={() => setOutcome(o.id as any)}
                  className="mt-0.5 accent-primary"
                />
                <div>
                  <div className="font-bold text-foreground">{o.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{o.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <Textarea
          label="RESOLUTION SUMMARY NOTES"
          placeholder="Optional resolution notes (e.g. Splicing restored at F-10/2 joint box. Signal tested to -19 dBm)..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </Modal>
  );
};
