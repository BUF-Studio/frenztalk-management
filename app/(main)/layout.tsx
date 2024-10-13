'use client'

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Home,
  SchoolRounded,
  SupervisedUserCircle,
  Group,
  Settings,
  LogoutRounded,
  Receipt,
  History,
  DashboardCustomize,
} from "@mui/icons-material"
import { cn } from "@/utils/manage-class-name"
import { useAuth } from "@/lib/context/AuthContext"
import { useUser } from "@/lib/context/collection/userContext"
import { useUsers } from "@/lib/context/collection/usersContext"
import { type User, UserRole } from "@/lib/models/user"
import {
  type Links,
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/app/components/general/sidebar"
import UserAvatar from "@/app/components/general/avatar"
import { storage } from "@/lib/firebase/service/clientApp"
import { getDownloadURL, ref } from "firebase/storage"

const Logo = ({ open }: { open: boolean }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useState(() => {
    const fetchLogo = async () => {
      try {
        const logoRef = ref(storage, 'frenztalk-logo.jpg')
        const url = await getDownloadURL(logoRef)
        setLogoUrl(url)
      } catch (error) {
        console.error("Error fetching logo:", error)
      }
    }
    fetchLogo()
  })

  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center justify-center text-sm text-black py-1 relative z-20"
    >
      {logoUrl && (
        <Image
          src={logoUrl}
          alt="Frenztalk Logo"
          width={80}
          height={80}
          priority
        />
      )}
      {/* {open && (
        <motion.span
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="font-medium text-black dark:text-white whitespace-pre"
        >
          Frenztalk
        </motion.span>
      )} */}
    </Link>
  )
}


export default function Layout({ children }: { children: React.ReactNode }) {
  const authContext = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useUser()
  const { verifiedUsers } = useUsers()
  const [open, setOpen] = useState(false)

  const findVerifiedUser = (id: string | undefined): User | undefined => {
    if (!id) return undefined
    console.log("verifiedUser " , verifiedUsers)
    return verifiedUsers.find((user) => user.id === id)
  }

  const allLinks: Links[] = [
    {
      label: "Home",
      href: "/tuitions",
      icon: (
        <Home
          strokeWidth={1.6}
          className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0"
        />
      ),
      roles: [UserRole.ADMIN, UserRole.TUTOR],
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: (
        <Receipt
          strokeWidth={1.6}
          className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0"
        />
      ),
      roles: [UserRole.ADMIN],
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
      roles: [UserRole.ADMIN, UserRole.TUTOR],
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
      roles: [UserRole.ADMIN],
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
      roles: [UserRole.ADMIN],
    },
    {
      label: "History",
      href: "/history",
      icon: (
        <History
          strokeWidth={1.6}
          className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0"
        />
      ),
      roles: [UserRole.ADMIN],
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
      roles: [UserRole.ADMIN],
    },
    {
      label: "Payments",
      href: "/payments",
      icon: (
        <Receipt
          strokeWidth={1.6}
          className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0"
        />
      ),
      roles: [UserRole.ADMIN, UserRole.TUTOR],
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
      roles: [UserRole.ADMIN],
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
      roles: [UserRole.ADMIN],
    },
    {
      label: "Logout",
      icon: (
        <LogoutRounded className="text-neutral-700 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
      onClick: async () => {
        await authContext.signOut()
        router.push("/sign-in")
      },
      roles: [UserRole.ADMIN, UserRole.TUTOR],
    },
  ]

  const links: Links[] = allLinks.filter((link) =>
    link.roles?.includes(user?.role ?? UserRole.TUTOR)
  )

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-transparent w-full flex-1 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo open={open} />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={link.href || idx}
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
                label:
                  findVerifiedUser(authContext.user?.uid)?.name ?? "Anonymous",
                href: "/profile",
                icon: (
                  <div className="w-8 h-8">
                    <UserAvatar url={authContext.user?.photoURL} />
                  </div>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-col flex-grow py-4 pr-4 overflow-hidden">
        <div className="flex-grow min-h-0 max-h-full overflow-auto rounded-xl p-4 ">
          {children}
        </div>
      </div>
    </div>
  )
}