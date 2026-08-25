import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'warning' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-mono font-bold uppercase focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const variants = {
      primary:
        'bg-primary hover:bg-primary-hover text-primary-foreground border-2 border-border shadow-primary active:translate-y-0.5',
      secondary:
        'bg-secondary hover:bg-secondary-hover text-secondary-foreground border-2 border-border shadow-sm active:translate-y-0.5',
      destructive:
        'bg-destructive hover:bg-destructive-hover text-destructive-foreground border-2 border-border shadow-destructive active:translate-y-0.5',
      warning:
        'bg-warning hover:bg-warning-hover text-warning-foreground border-2 border-border shadow-sm active:translate-y-0.5',
      info:
        'bg-info hover:bg-info-hover text-info-foreground border-2 border-border shadow-sm active:translate-y-0.5',
      outline:
        'bg-card hover:bg-card-subtle text-foreground border-2 border-border shadow-sm hover:border-primary active:translate-y-0.5',
      ghost:
        'bg-transparent hover:bg-card-subtle text-foreground hover:text-primary active:translate-y-0.5',
    };

    const sizes = {
      xs: 'px-2.5 py-1 text-[10px] gap-1',
      sm: 'px-3.5 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-xs gap-2',
      lg: 'px-6 py-3 text-sm gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
