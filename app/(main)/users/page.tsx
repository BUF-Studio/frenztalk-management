"use client";

import { useUsers } from "@/lib/context/collection/usersContext";
import { useUserPage } from "@/lib/context/page/userPageContext";
import { type User, UserRole } from "@/lib/models/user";
import { cn } from "@/utils/manage-class-name";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode;
  notify?: number;
};

import UserModalDialog from "./userModalDialog";
import { columns } from "./columns";
import { DataTable } from "@/app/components/ui/data-table";

export default function UserList() {
  const { verifiedUsers, unverifiedUsers } = useUsers();
  const { user, setUser } = useUserPage();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialTabs = [
    {
      title: "Users",
      value: "users",
      content: (
        <DataTable
          data={verifiedUsers}
          columns={columns}
          getRowHref={(user) => {
            router.push(`/users/${user?.id}`);
            setUser(user);
          }}
        />
      ),
    },
    {
      title: "Requests",
      value: "request",
      content: (
        <DataTable
          data={unverifiedUsers}
          columns={columns}
          getRowHref={(user) => {
            router.push(`/users/${user?.id}`);
            setUser(user);
          }}
        />
      ),
      notify: unverifiedUsers.length,
    },
  ];

  const [active, setActive] = useState(initialTabs[0].value);

  const [tabs, setTabs] = useState<Tab[]>(initialTabs);

  const moveSelectedTabToTop = (idx: number) => {
    const newTabs = [...initialTabs];
    const selectedTab = newTabs.splice(idx, 1);
    newTabs.unshift(selectedTab[0]);
    setTabs(newTabs);
    console.log(newTabs[0].value);
    setActive(newTabs[0].value);
  };

  const [hovering, setHovering] = useState(false);

  const editUser = (user: User) => {
    router.push(`/users/${user.id}`);
  };

  return (
    <div>
      <div className="flex flex-1 flex-row justify-between items-center pb-4">
        <div className="flex flex-row items-center">
          <h1 className="text-xl font-bold">User List</h1>
          <div className="flex flex-row items-center ml-5 space-x-2">
            {initialTabs.map((tab, idx) => (
              <button
                type="button"
                key={tab.title}
                onClick={() => {
                  moveSelectedTabToTop(idx);
                }}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                className={cn("relative flex flex-row px-4 py-2 rounded-full")}
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {active === tab.value && (
                  <motion.div
                    layoutId="clickedbutton"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                    className={cn(
                      "absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full "
                    )}
                  />
                )}

                <span className="relative block text-black dark:text-white">
                  {tab.title}
                </span>
                {tab.notify && tab.notify > 0 && (
                  <span
                    className={cn(
                      "z-10 bg-red-500 text-xs font-medium text-white",
                      "flex items-center justify-center",
                      "w-5 h-5 rounded-full",
                      active === tab.value
                        ? "absolute -top-1 -right-1"
                        : "relative ml-2"
                    )}
                  >
                    {tab.notify}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      {initialTabs.map((tab) => {
        if (tab.value === active) {
          return tab.content;
        }
        return null;
      })}
      <UserModalDialog
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        user={user}
        setUser={setUser}
      />
    </div>
  );
}
