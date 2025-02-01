// components/Providers.tsx
"use client";

import { Provider } from "react-redux";
import { useEffect, useState } from "react";
import { initializeClientStore } from "@/lib/store/clientStore";
import { useHydrateAuth } from "@/lib/store/hooks/useHydrateAuth";

export function Providers({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<ReturnType<typeof initializeClientStore>>();
  
  useEffect(() => {
    setStore(initializeClientStore());
  }, []);

  if (!store) return null;

  return (
    <Provider store={store}>
      <AuthHydrator>{children}</AuthHydrator>
    </Provider>
  );
}

function AuthHydrator({ children }: { children: React.ReactNode }) {
  useHydrateAuth();
  return <>{children}</>;
}