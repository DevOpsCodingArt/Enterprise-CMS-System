import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'primary' | 'destructive';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-card border-2 border-border shadow-md',
      subtle: 'bg-card-subtle border-2 border-border',
      primary: 'bg-card border-2 border-primary shadow-primary',
      destructive: 'bg-card border-2 border-destructive shadow-destructive',
    };

    return (
      <div ref={ref} className={cn(variants[variant], className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
