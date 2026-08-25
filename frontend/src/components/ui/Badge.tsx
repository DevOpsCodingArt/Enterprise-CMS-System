import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'warning'
  | 'info'
  | 'outline';
  size?: 'xs' | 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'sm',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-mono font-bold uppercase border';

  const variants = {
    default: 'bg-card-subtle text-foreground border-border',
    primary: 'bg-primary text-primary-foreground border-border shadow-sm',
    secondary: 'bg-secondary text-secondary-foreground border-border',
    destructive: 'bg-destructive text-destructive-foreground border-border shadow-sm',
    warning: 'bg-warning text-warning-foreground border-border',
    info: 'bg-info text-info-foreground border-border',
    outline: 'bg-transparent text-foreground border-border',
  };

  const sizes = {
    xs: 'px-1.5 py-0.2 text-[9px]',
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
