"use client";


import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "./sidebar";
import StudentsProvider from "@/lib/context/collection/studentsContext";
import TutorsProvider from "@/lib/context/collection/tutorContext";
import InvoicesProvider from "@/lib/context/collection/invoiceContext";
import StudentProvider from "@/lib/context/page/studentContext";
import UserProvider from "@/lib/context/collection/userContext";

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
        <UserProvider userId="72AiGSs5ZvRLeA9MKEDz88821Y12">

          <StudentsProvider tutorId="1">
            <TutorsProvider>
              <InvoicesProvider>
                <StudentProvider>

                  <div className="flex">
                    <Sidebar />
                    <main className="flex-1 p-4">
                      {children}
                    </main>
                  </div>
                </StudentProvider>
              </InvoicesProvider>
            </TutorsProvider>
          </StudentsProvider>

        </UserProvider>

      </body>
    </html>
  );
}
