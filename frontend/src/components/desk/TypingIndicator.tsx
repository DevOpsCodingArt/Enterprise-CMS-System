import React from 'react';

export const TypingIndicator: React.FC<{ name?: string }> = ({ name = 'Customer' }) => {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border text-[11px] font-mono text-muted-foreground w-fit animate-pulse mb-2">
      <span className="flex gap-1 items-center">
        <span className="w-1.5 h-1.5 bg-primary rounded-none animate-bounce" />
        <span className="w-1.5 h-1.5 bg-primary rounded-none animate-bounce [animation-delay:0.2s]" />
        <span className="w-1.5 h-1.5 bg-primary rounded-none animate-bounce [animation-delay:0.4s]" />
      </span>
      <span>{name} is typing...</span>
    </div>
  );
};
