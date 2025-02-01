// components/DynamicProvider.tsx
"use client";

import LoadingScreen from "@/components/LoadingSpinner";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const ClientProviders = dynamic(
  () => import("@/app/StoreProvider").then((mod) => mod.Providers),
  {
    ssr: false,
    loading: () => <LoadingScreen />,
  }
);

export default function DynamicProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ClientProviders>
        <Navbar />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: { background: "#fff", color: "#000" },
          }}
        />
      </ClientProviders>
    </Suspense>
  );
}
