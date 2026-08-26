import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'warning' | 'success' | 'info';
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
      'inline-flex items-center justify-center font-sans font-medium rounded-lg transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none';

    const variants = {
      primary:
        'bg-primary hover:bg-primary-hover text-primary-foreground shadow-xs shadow-primary/20 active:scale-98',
      secondary:
        'bg-secondary hover:bg-secondary-hover text-secondary-foreground shadow-xs active:scale-98',
      destructive:
        'bg-destructive hover:bg-destructive-hover text-destructive-foreground shadow-xs shadow-destructive/20 active:scale-98',
      warning:
        'bg-warning hover:bg-warning-hover text-warning-foreground shadow-xs active:scale-98',
      success:
        'bg-success hover:bg-success-hover text-primary-foreground shadow-xs active:scale-98',
      info:
        'bg-info hover:bg-info-hover text-primary-foreground shadow-xs active:scale-98',
      outline:
        'bg-card hover:bg-muted/60 text-foreground border border-border hover:border-border/80 shadow-xs active:scale-98',
      ghost:
        'bg-transparent hover:bg-muted text-foreground/80 hover:text-foreground active:scale-98',
    };

    const sizes = {
      xs: 'px-2.5 py-1 text-xs gap-1.5 rounded-md',
      sm: 'px-3 py-1.5 text-xs font-medium gap-1.5 rounded-lg',
      md: 'px-4 py-2 text-sm font-medium gap-2 rounded-lg',
      lg: 'px-5 py-2.5 text-base font-semibold gap-2.5 rounded-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
