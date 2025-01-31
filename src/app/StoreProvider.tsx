"use client";
import { Provider } from "react-redux";
import { store } from "@/lib/store/store";
import { useEffect, useState } from "react";
import { useHydrateAuth } from "@/lib/store/hooks/useHydrateAuth";
import useAuth from "@/lib/store/hooks/useAuth";

export function Providers({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Ensure component mounts properly
  }, []);

  if (!isClient) return null; // Prevent rendering until client-side hydration is done

  return (
    <Provider store={store}>
      <HydrateAuthWrapper>{children}</HydrateAuthWrapper>
    </Provider>
  );
}

// ✅ Ensure hydration happens inside Provider
function HydrateAuthWrapper({ children }: { children: React.ReactNode }) {
  useHydrateAuth();
  const isHydrated = useAuth();

  if (!isHydrated) return null; // Wait for hydration before rendering

  return <>{children}</>;
}
