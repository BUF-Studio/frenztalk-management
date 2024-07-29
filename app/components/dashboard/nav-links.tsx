"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/components/dashboard/NavLinks.module.scss";
import clsx from "clsx";
import { useAuth } from "@/lib/context/AuthContext";
import { UserRole } from "@/lib/models/user";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const tutorLinks = [
  {
    name: "Home",
    href: "/",
    // icon: HomeIcon
  },
  {
    name: "Invoices",
    href: "/invoice",
    // icon: DocumentDuplicateIcon,
  },
];

const adminLinks = [
  {
    name: "Home",
    href: "/tuition",
    // icon: HomeIcon
  },
  {
    name: "Tutors",
    href: "/tutors",
    // icon: DocumentDuplicateIcon,
  },
  {
    name: "Students",
    href: "/students",
    // icon: UserGroupIcon,
  },
  {
    name: "Users",
    href: "/users",
    // icon: UserGroupIcon,
  },
  {
    name: "Invoices",
    href: "/invoice",
    // icon: CogIcon,
  },
  {
    name: "Academic Setup",
    href: "/academic-setup",
    // icon: HomeIcon
  },
  {
    name: "Settings",
    href: "/settings",
    // icon: CogIcon,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  const { role } = useAuth();

  return (
    <div className={styles.linksContainer}>
      {(role === UserRole.ADMIN ? adminLinks : tutorLinks).map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={clsx(styles.link, {
            [styles.activeLink]: pathname === link.href,
          })}
        >
          <p>{link.name}</p>
        </Link>
      ))}
    </div>
  );
}
