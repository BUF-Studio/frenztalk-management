"use client";

import type React from "react";
import { useState } from "react";
import {
  type Links,
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "../components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Image from "next/image";
import {
  Home,
  SchoolRounded,
  SupervisedUserCircle,
  Group,
  Settings,
  LogoutRounded,
  Receipt,
  DashboardCustomize,
} from "@mui/icons-material";
import { cn } from "@/utils/manage-class-name";
import Link from "next/link";
import { motion, useAnimationControls } from "framer-motion";
import { useAuth } from "@/lib/context/AuthContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  const authContext = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const links: Links[] = [
    {
      label: "Home",
      href: "/tuitions",
      icon: (
        <Home
          strokeWidth={1.6}
          className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0"
        />
      ),
    },
    {
      label: "Students",
      href: "/students",
      icon: (
        <SchoolRounded
          strokeWidth={1.6}
          className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0"
        />
      ),
    },
    {
      label: "Tutors",
      href: "/tutors",
      icon: (
        <SupervisedUserCircle
          strokeWidth={1.6}
          className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0"
        />
      ),
    },
    {
      label: "Users",
      href: "/users",
      icon: (
        <Group
          strokeWidth={1.6}
          className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0"
        />
      ),
    },
    {
      label: "Invoices",
      href: "/invoices",
      icon: (
        <Receipt
          strokeWidth={1.6}
          className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0"
        />
      ),
    },
    {
      label: "Academic Setup",
      href: "/academic-setup",
      icon: (
        <DashboardCustomize
          strokeWidth={1.6}
          className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0"
        />
      ),
    },
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <Settings
          strokeWidth={1.6}
          className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0"
        />
      ),
    },
    {
      label: "Logout",
      icon: (
        <LogoutRounded className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
      onClick: (async () => {
        await authContext.signOut();
        router.push("/sign-in");
      }),
    },
  ];

  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-transparent w-full flex-1 overflow-hidden",
        "h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo open={open} />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={idx}
                  link={link}
                  className={
                    link.href && pathname?.startsWith(link.href)
                      ? "rounded-md bg-red-200 dark:bg-red-900"
                      : ""
                  }
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: authContext.user?.displayName ?? "Anonymous",
                href: "/profile",
                icon: (
                  //TODO: Change the default image type based on the theme mode
                  <Image
                    src={authContext.user?.photoURL ?? "/account-darkmode.png"}
                    className="h-8 w-8 flex-shrink-0 rounded-full object-cover"
                    width={24}
                    height={24}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-col flex-grow py-4 pr-4 overflow-hidden">
        <div className="flex-grow min-h-0 max-h-full overflow-auto rounded-xl p-4 bg-neutral-100 dark:bg-neutral-900">
          {children}
        </div>
      </div>
    </div>
  );
}

export const Logo = ({ open }: { open: boolean }) => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image
        src="/frenztalk-logo.jpg"
        alt="Frenztalk Logo"
        width={80}
        height={80}
        priority
        className="h-10 w-10 bg-black dark:bg-white flex-shrink-0"
      />
      {true && (
        <motion.span
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="font-medium text-black dark:text-white whitespace-pre"
        >
          Frenztalk
        </motion.span>
      )}
    </Link>
  );
};
