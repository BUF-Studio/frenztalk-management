// lib/ProtectedRoute.tsx
import { useRouter } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from './context/AuthContext';
import type { UserRole } from './enums';

type ProtectedRouteProps = {
  children: ReactNode;
  allowedRoles?: UserRole[];
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      console.log('User not found');
      router.push('/sign-in');
    } else if (role && allowedRoles && !allowedRoles.includes(role)) {
      router.push('/403');
    }
  }, [user, allowedRoles, role, router]);

  if (user && role && (!allowedRoles || allowedRoles.includes(role))) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedRoute;
