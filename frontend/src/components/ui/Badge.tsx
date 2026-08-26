import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
  | 'default'
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'warning'
  | 'success'
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
  const baseStyles = 'inline-flex items-center font-sans font-medium rounded-full transition-colors';

  const variants = {
    default: 'bg-muted text-muted-foreground border border-border/80',
    primary: 'bg-primary/10 text-primary border border-primary/20',
    secondary: 'bg-secondary/10 text-secondary-foreground border border-secondary/20',
    destructive: 'bg-destructive/10 text-destructive border border-destructive/20',
    warning: 'bg-warning/15 text-warning-foreground dark:text-warning border border-warning/25',
    success: 'bg-success/10 text-success border border-success/20',
    info: 'bg-info/10 text-info-foreground dark:text-info border border-info/20',
    outline: 'bg-transparent text-foreground border border-border',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs font-semibold',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
