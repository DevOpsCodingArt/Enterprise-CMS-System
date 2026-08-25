'use client';

import React, { useState } from 'react';
import { Star, ThumbsUp, Heart, Send } from 'lucide-react';
import { useCustomerPortalStore } from '@/stores/customer-portal-store';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';

export function CsatRatingModal() {
  const { isCsatModalOpen, setCsatModalOpen, submitCsatRating } = useCustomerPortalStore();
  const { showToast } = useToast();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');

  const ratingLabels = [
    'Very Dissatisfied',
    'Needs Improvement',
    'Satisfactory',
    'Great Service',
    'Outstanding Support! 🚀',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCsatRating(rating, feedback.trim());
    showToast('Feedback Received', 'Thank you! Your CSAT review helps us maintain high SLA quality.', 'success');
    setFeedback('');
    setRating(5);
  };

  return (
    <Modal
      isOpen={isCsatModalOpen}
      onClose={() => setCsatModalOpen(false)}
      title="How was your support experience?"
      subtitle="Rate the resolution quality of your recent support interaction."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-center">
        {/* Star Rating Group */}
        <div className="py-2 space-y-2">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating ?? rating) >= star;
              return (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1.5 focus:outline-hidden transform hover:scale-115 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      active
                        ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                        : 'text-muted-foreground/40'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="font-heading font-semibold text-sm text-foreground">
            {ratingLabels[(hoverRating ?? rating) - 1]}
          </div>
        </div>

        <Textarea
          placeholder="Optional comments on response time or field engineer professionalism..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3}
        />

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setCsatModalOpen(false)}
          >
            Skip
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            leftIcon={<ThumbsUp className="w-3.5 h-3.5" />}
          >
            Submit Feedback
          </Button>
        </div>
      </form>
    </Modal>
  );
}
