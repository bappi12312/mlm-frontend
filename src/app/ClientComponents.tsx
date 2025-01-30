"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { StoreProvider } from "./StoreProvider";
import { Toaster } from "@/components/ui/sonner";
import NavbarSkeleton from '@/components/NavbarSkeleton';

// Dynamic import with proper type safety and loading state
const Navbar = dynamic(() => import("@/components/navbar"), { 
  ssr: false,
  loading: () => <NavbarSkeleton />,
});

export default function ClientComponents({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <StoreProvider>
      <Suspense fallback={<NavbarSkeleton />}>
        <Navbar />
      </Suspense>
      
      {children}
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
          style: { background: '#fff', color: '#000' },
        }}
      />
    </StoreProvider>
  );
}