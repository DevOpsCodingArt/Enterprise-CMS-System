'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { ArrowRightLeft, ShieldAlert } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface TransferChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationId: string;
  onTransferSuccess?: () => void;
}

export const TransferChatModal: React.FC<TransferChatModalProps> = ({
  isOpen,
  onClose,
  conversationId,
  onTransferSuccess,
}) => {
  const [targetAgent, setTargetAgent] = useState('usr_imran_field_04');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const agentOptions = [
    { value: 'usr_imran_field_04', label: 'Eng. Imran Khan (Van 04 - Field Fiber Splicer)' },
    { value: 'usr_bilal_noc_02', label: 'Eng. Bilal Ahmed (NOC Core Specialist)' },
    { value: 'usr_hamza_acc_01', label: 'Hamza Tariq (Accounts & Billing Lead)' },
    { value: 'usr_usman_sup_01', label: 'Eng. Usman Ali (Rawalpindi Hub Supervisor)' },
  ];

  const handleTransfer = async () => {
    if (!reason.trim()) {
      setError('Transfer reason is mandatory for audit compliance.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      showToast(
        'Chat Transferred Successfully',
        `Transferred to ${agentOptions.find((a) => a.value === targetAgent)?.label}`,
        'success'
      );

      setReason('');
      onClose();
      if (onTransferSuccess) onTransferSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to transfer chat');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="TRANSFER CONVERSATION // AUDIT LOGGED"
      subtitle="HD-014: Transfer chat with mandatory reason and immutable audit history."
      size="md"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleTransfer}
            isLoading={isSubmitting}
            leftIcon={<ArrowRightLeft className="w-3.5 h-3.5" />}
          >
            CONFIRM TRANSFER
          </Button>
        </>
      }
    >
      <div className="space-y-4 font-mono text-xs">
        <div className="p-3 bg-card-subtle border border-border flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-muted-foreground text-xs leading-relaxed">
            All transfers are recorded in the central compliance audit log with timestamp, sender, target assignee, and reason.
          </div>
        </div>

        <Select
          label="TARGET STAFF / DEPARTMENT"
          options={agentOptions}
          value={targetAgent}
          onChange={(e) => setTargetAgent(e.target.value)}
        />

        <Textarea
          label="MANDATORY TRANSFER REASON"
          placeholder="Explain why this interaction is being transferred (e.g. Physical fiber cut on PON-4 requiring OTDR dispatch)..."
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            if (error) setError('');
          }}
          error={error}
        />
      </div>
    </Modal>
  );
};
