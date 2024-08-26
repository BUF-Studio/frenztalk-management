"use client";

import { useAuth } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const LogoutPage = () => {
  const authContext = useAuth();
  const router = useRouter();

  useEffect(() => {
    async function signOut() {
      try {
        c
      } catch (error) {
        //TODO: Show error message in a snackbar
        alert("Error signing out: " + error);
      }
    }
    signOut();
  });
};

export default LogoutPage;
