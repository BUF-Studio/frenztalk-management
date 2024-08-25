"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const LogoutPage = () => {
  const authContext = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function signOut() {
      await authContext.signOut();
      router.push("/sign-in");
    }
    signOut();
  });
};

export default LogoutPage;
