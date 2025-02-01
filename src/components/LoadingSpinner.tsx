// components/LoadingScreen.tsx
"use client";

import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

export default function LoadingScreen() {
  const [showLoader, setShowLoader] = useState(false);

  // Delay loader appearance to prevent flickering
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      {showLoader && (
        <ClipLoader
          size={40}
          color="hsl(var(--primary))"
          cssOverride={{
            borderWidth: "3px",
          }}
        />
      )}
    </div>
  );
}