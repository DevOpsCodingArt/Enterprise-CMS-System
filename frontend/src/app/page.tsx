'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootHomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center font-sans">
      <div className="text-center space-y-2">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-muted-foreground">Redirecting to Prime One Portal Gateway...</p>
      </div>
    </div>
  );
}
