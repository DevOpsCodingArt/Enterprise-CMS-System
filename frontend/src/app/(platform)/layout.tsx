import React from 'react';
import { PlatformHeader } from '@/components/layout/PlatformHeader';
import { PlatformSidebar } from '@/components/layout/PlatformSidebar';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen max-h-screen flex flex-col overflow-hidden bg-background text-foreground">
      {/* Universal Super-Admin Platform Header */}
      <PlatformHeader />

      {/* Main SaaS Platform Layout (Sidebar + Center Content) */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        <PlatformSidebar />
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-6 bg-background custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
