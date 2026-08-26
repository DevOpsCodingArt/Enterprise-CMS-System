import React from 'react';
import { cn, getInitials } from '@/lib/utils';
import Image from 'next/image';

export interface AvatarProps {
  name?: string | null;
  src?: string | null;
  size?: 'sm' | 'md' | 'lg';
  status?: 'online' | 'busy' | 'away' | 'offline';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = 'md',
  status,
  className,
}) => {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };

  const statusColors = {
    online: 'bg-success',
    busy: 'bg-destructive',
    away: 'bg-warning',
    offline: 'bg-muted-foreground',
  };

  return (
    <div className="relative inline-block flex-shrink-0">
      <div
        className={cn(
          'rounded-full border border-border/80 bg-muted/60 flex items-center justify-center font-sans font-semibold text-foreground overflow-hidden shadow-2xs',
          sizes[size],
          className
        )}
      >
        {src ? (
          <Image src={src} alt={name || 'Avatar'} fill className="object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card ring-1 ring-background',
            statusColors[status]
          )}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};
