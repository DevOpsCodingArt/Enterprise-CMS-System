import React from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen max-h-screen flex flex-col overflow-hidden bg-background text-foreground">
      {/* Universal App Header */}
      <AppHeader />

      {/* Main Workspace Layout (Sidebar + Center Content) */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        <AppSidebar />
        <main className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden bg-background custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
