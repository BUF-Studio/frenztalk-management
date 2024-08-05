"use client";

import type React from "react";
import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/sidebar";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { GraduationCap, House, UserRound, UsersRound } from "lucide-react";
import {
  Home,
  SchoolRounded,
  SupervisedUserCircle,
  Group,
  Settings,
  LogoutRounded,
} from "@mui/icons-material";
import { cn } from "@/utils/manage-class-name";
import Link from "next/link";
import { motion, useAnimationControls } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const links = [
    {
      label: "Home",
      href: "/back/tuitions",
      icon: (
        <Home
          color="primary"
          className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0"
        />
      ),
    },
    {
      label: "Students",
      href: "/back/students",
      icon: (
        <SchoolRounded
          strokeWidth={1.6}
          className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0"
        />
      ),
    },
    {
      label: "Tutors",
      href: "/back/tutors",
      icon: (
        <SupervisedUserCircle
          strokeWidth={1.6}
          className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0"
        />
      ),
    },
    {
      label: "Users",
      href: "/back/users",
      icon: (
        <Group
          strokeWidth={1.6}
          className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0"
        />
      ),
    },
    {
      label: "Settings",
      href: "/back/settings",
      icon: (
        <Settings
          strokeWidth={1.6}
          className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0"
        />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <LogoutRounded className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 overflow-hidden",
        "h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={true} setOpen={setOpen} animate={false}>
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
                    pathname === link.href
                      ? "bg-neutral-200 dark:bg-neutral-700"
                      : ""
                  }
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <Image
                    src="/steveJobs.png"
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
      {children}
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