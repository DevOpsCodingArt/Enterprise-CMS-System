import React from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-mono font-bold text-foreground mb-1.5 uppercase"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            'w-full bg-card border-2 border-border p-3 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary disabled:opacity-50 min-h-[90px]',
            error && 'border-destructive focus:border-destructive',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-[10px] font-mono text-destructive font-bold">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
