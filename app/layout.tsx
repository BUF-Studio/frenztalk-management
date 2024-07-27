"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppProvider from "./appProviders";
import SideNav from "./components/dashboard/sidenav";
import { AuthContextProvider } from "@/lib/context/AuthContext";
import { SnackbarProvider } from "@/lib/context/component/SnackbarContext";
import { AlertProvider } from "@/lib/context/component/AlertContext";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Create Next App",
//   description: "Generated by create next app",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AlertProvider>
          <SnackbarProvider>
            <AuthContextProvider>
              <AppProvider>
                <div className="flex">
                  {/* <Sidebar /> */}
                  <main className="flex-1">{children}</main>
                </div>
              </AppProvider>
            </AuthContextProvider>
          </SnackbarProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
