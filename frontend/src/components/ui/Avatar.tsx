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
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-12 h-12 text-sm',
  };

  const statusColors = {
    online: 'bg-primary',
    busy: 'bg-destructive',
    away: 'bg-warning',
    offline: 'bg-muted-foreground',
  };

  return (
    <div className="relative inline-block flex-shrink-0">
      <div
        className={cn(
          'border-2 border-border bg-card-subtle flex items-center justify-center font-mono font-black text-foreground overflow-hidden uppercase shadow-sm',
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
            'absolute bottom-0 right-0 w-2.5 h-2.5 border-2 border-card rounded-none',
            statusColors[status]
          )}
          title={`Status: ${status}`}
        />
      )}
    </div>
  );
};
