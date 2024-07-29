"use client";

import SideNav from "@/app/components/dashboard/sidenav";
import Header from "@/app/components/dashboard/Header";
import { usePathname } from "next/navigation";
import styles from "@/styles/main/Main.module.scss";
import ProtectedRoute from "@/lib/ProtectedRoute";
import { UserRole } from "@/lib/models/user";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  let currentLocation = "Home";
  if (pathname.includes("/invoice")) {
    currentLocation = "Invoices";
  } else if (pathname.includes("/tutors")) {
    currentLocation = "Tutors";
  } else if (pathname.includes("/students")) {
    currentLocation = "Students";
  } else if (pathname.includes("/settings")) {
    currentLocation = "Settings";
  } else if (pathname.includes("/users")) {
    currentLocation = "Users";
  } else if (pathname.includes("/academic-setup")) {
    currentLocation = "Academic Setup";
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.TUTOR]}>
      <div className={styles.layout}>
        <div className={styles.sideNav}>
          <SideNav />
        </div>
        <div className={styles.main}>
          <Header currentLocation={currentLocation} />
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
