import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-mono font-bold text-foreground mb-1.5 uppercase"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'w-full bg-card border-2 border-border px-3.5 py-2 pr-9 text-xs font-mono text-foreground focus:outline-none focus:border-primary appearance-none cursor-pointer disabled:opacity-50',
              error && 'border-destructive focus:border-destructive',
              className
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-card text-foreground">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 w-4 h-4 pointer-events-none text-muted-foreground" />
        </div>
        {error && (
          <p className="mt-1 text-[10px] font-mono text-destructive font-bold">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
