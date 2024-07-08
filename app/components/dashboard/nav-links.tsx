"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../../styles/components/dashboard/NavLinks.module.scss";
import clsx from "clsx";

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  {
    name: "Tutors",
    href: "/tutors",
    // icon: HomeIcon
  },
  {
    name: "Invoices",
    href: "/invoice",
    // icon: DocumentDuplicateIcon,
  },
  {
    name: "Customers",
    href: "/students",
    // icon: UserGroupIcon,
  },
  // {
  //   name: "Settings",
  //   href: "/settings",
  //   // icon: CogIcon,
  // },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className={styles.linksContainer}>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={clsx(styles.link, {
            [styles.activeLink]: pathname === link.href,
          })}
        >
          <p className="hidden md:block">{link.name}</p>
        </Link>
      ))}
    </div>
  );
}
