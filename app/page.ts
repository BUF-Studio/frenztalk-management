// pages/index.tsx
"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import ProtectedRoute from "@/lib/ProtectedRoute";
import { UserRole } from "@/lib/enums";

const HomePage = () => {
  const { user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      if (role === UserRole.ADMIN) {
        router.push("/admin/tutors");
      } else if (role === UserRole.TUTOR) {
        router.push("/");
      } else {
        router.push("/sign-in");
      }
    } else {
      router.push("/sign-in");
    }
  }, [user, role, router]);

};

export default HomePage;
