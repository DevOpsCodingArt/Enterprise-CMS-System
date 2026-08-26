import React from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import { AppSidebar } from '@/components/layout/AppSidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen max-h-screen flex overflow-hidden bg-background text-foreground">
      {/* Full-Height Universal App Sidebar (Top to Bottom) */}
      <AppSidebar />

      {/* Main Workspace (Top Header + Center Content) */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 min-h-0 flex flex-col overflow-y-auto overflow-x-hidden bg-background custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
