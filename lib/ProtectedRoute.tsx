// lib/ProtectedRoute.tsx
import { useRouter } from "next/navigation";
import { Suspense, useEffect, type ReactNode } from "react";
import { useAuth } from "./context/AuthContext";
import type { UserRole } from "./enums";

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: UserRole[];
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log("User not found");
        router.push("/sign-in");
      } else if (role && allowedRoles && !allowedRoles.includes(role)) {
        router.push("/403");
      }
    }
  }, [user, allowedRoles, loading, role, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user && role && (!allowedRoles || allowedRoles.includes(role))) {
    return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
  }

  return null;
};

export default ProtectedRoute;
