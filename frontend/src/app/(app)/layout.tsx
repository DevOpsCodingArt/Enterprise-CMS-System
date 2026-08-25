import React from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Universal App Header */}
      <AppHeader />

      {/* Main Workspace Layout (Sidebar + Center Content) */}
      <div className="flex-1 flex overflow-hidden">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-y-auto min-w-0 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
