"use client";

import SideNav from "@/app/components/dashboard/sidenav";
import Header from "@/app/components/dashboard/Header";
import { useRouter } from "next/navigation";
import styles from "../styles/main/Main.module.scss";
import ProtectedRoute from "@/lib/ProtectedRoute";
import { UserRole } from "@/lib/enums";

export default function Layout({ children }: { children: React.ReactNode }) {
  //   const router = useRouter();
  const currentLocation = "Home";

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
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
