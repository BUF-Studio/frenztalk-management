"use client";

import { CounterProvider, useCounter } from "@/lib/context/counterContext";
import { AppProps } from "next/app";
import type React from "react";
import { useAuth } from "../lib/context/AuthContext";
import { redirect } from "next/navigation";
import { UserRole } from "@/lib/enums";

const HomePage = () => {
  const auth = useAuth();

  return (
    <div>
      <h1>Welcome, ${auth.user?.email}</h1>
    </div>
  );

  // if (!auth.user) {
  //   console.log("No user");
  //   redirect("/sign-in");
  // } else {
  //   if (auth.role === UserRole.ADMIN) {
  //     redirect("/admin/invoice");
  //   } else if (auth.role === UserRole.TUTOR) {
  //     redirect("/tutor");
  //   } else if (auth.role === UserRole.NON_VERIFIED) {
  //     console.log("User not verified");
  //   } else {
  //     console.log("User not assigned a role");
  //   }
  // }
}

export default HomePage;
