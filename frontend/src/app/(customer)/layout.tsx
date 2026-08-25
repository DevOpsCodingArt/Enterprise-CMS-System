'use client';

import React from 'react';
import { CustomerHeader } from '@/components/customer/CustomerHeader';
import { CustomerNav } from '@/components/customer/CustomerNav';
import { PaymentUploadModal } from '@/components/customer/PaymentUploadModal';
import { CreateComplaintModal } from '@/components/customer/CreateComplaintModal';
import { CsatRatingModal } from '@/components/customer/CsatRatingModal';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased pb-16 md:pb-6">
      {/* Customer Master Header */}
      <CustomerHeader />

      {/* Navigation Bar (Desktop top tabs & Mobile bottom bar) */}
      <CustomerNav />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* Global Modals for Customer Actions */}
      <PaymentUploadModal />
      <CreateComplaintModal />
      <CsatRatingModal />
    </div>
  );
}
