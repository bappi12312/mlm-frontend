"use client";

import { Provider } from "react-redux";
import { initializeStore } from "@/lib/store/store";
import { useRef } from "react";
import { useHydrateAuth } from "@/lib/store/hooks/useHydrateAuth";

export function Providers({ children }: { children: React.ReactNode }) {
  // Provide null as initial value and specify the type
  const storeRef = useRef<ReturnType<typeof initializeStore> | null>(null);

  if (!storeRef.current) {
    storeRef.current = initializeStore();
  }

  return (
    <Provider store={storeRef.current}>
      <AuthHydrator>{children}</AuthHydrator>
    </Provider>
  );
}

function AuthHydrator({ children }: { children: React.ReactNode }) {
  useHydrateAuth();
  return <>{children}</>;
}

// export function Providers({ children }: { children: React.ReactNode }) {
//   const [store] = useState(() => initializeStore());
  
//   return (
//     <Provider store={store}>
//       <AuthHydrator>{children}</AuthHydrator>
//     </Provider>
//   );
// }