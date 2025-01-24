"use client";

import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated } = useSelector((store: any) => store.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Render nothing while redirecting
  }

  return <>{children}</>;
};

export const AuthenticatedUser = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const { isAuthenticated } = useSelector((store: any) => store.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; // Render nothing while redirecting
  }

  return <>{children}</>;
};

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((store: any) => store.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role !== "admin") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "admin") {
    return null; // Render nothing while redirecting
  }

  return <>{children}</>;
};
