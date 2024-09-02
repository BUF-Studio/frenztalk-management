"use client";

import { DataTable } from "@/app/components/dashboard/DataTable";
import { SearchBar } from "@/app/components/general/input/searchBar";
import { Tabs } from "@/app/components/general/tabs";
import { useUsers } from "@/lib/context/collection/usersContext";
import { useUserPage } from "@/lib/context/page/userPageContext";
import { TableOrderEnum } from "@/lib/enums/TableOrderEnum";
import { useSearchTableData } from "@/lib/general_hooks/useSearchTableData";
import { useTableColumn } from "@/lib/general_hooks/useTableColumn";
import { type User, UserRole } from "@/lib/models/user";
import { cn } from "@/utils/manage-class-name";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const initialColumns: { key: keyof User; label: string; order: string }[] = [
  { key: "name", label: "Name", order: TableOrderEnum.NONE },
  { key: "email", label: "Email", order: TableOrderEnum.NONE },
  { key: "role", label: "Role", order: TableOrderEnum.NONE },
];

type Tab = {
  title: string;
  value: string;
  content?: string | React.ReactNode;
  notify?: number;
};
import UserModalDialog from "./userModalDialog";

export default function UserList() {
  const { verifiedUsers, unverifiedUsers } = useUsers();
  const { user, setUser } = useUserPage();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState<string>("");


  // prettier-ignore
  const [verifiedUsersColumns, setVerifiedUsersColumns] = useState(initialColumns);
  // prettier-ignore
  const [unverifiedUsersColumns, setUnverifiedUsersColumns] = useState(initialColumns);

  // prettier-ignore
  const { sortedData: sortedVerifiedUser, sortColumn: sortVerifiedUsers } = useTableColumn(verifiedUsers, verifiedUsersColumns, setVerifiedUsersColumns);

  // prettier-ignore
  const { sortedData: sortedUnverifiedUsers, sortColumn: sortUnverifiedUsers } = useTableColumn(unverifiedUsers, unverifiedUsersColumns, setUnverifiedUsersColumns);

  // prettier-ignore
  const { filteredData : filteredVerifiedUser } = useSearchTableData(sortedVerifiedUser, searchTerm);
  // prettier-ignore
  const { filteredData: filteredUnverifiedUser } = useSearchTableData(sortedUnverifiedUsers, searchTerm);

  const initialTabs = [
    {
      title: "Users",
      value: "users",
      content: (
        <DataTable
          data={filteredVerifiedUser}
          columns={verifiedUsersColumns}
          actions={[]}
          onRowClick={(user) => editUser(user)}
          onColumnClick={(column) =>
            sortVerifiedUsers(column, verifiedUsersColumns)
          }
        />
      ),
    },
    {
      title: "Requests",
      value: "request",
      content: (
        <DataTable
          data={filteredUnverifiedUser}
          columns={unverifiedUsersColumns}
          actions={[]}
          onRowClick={(user) => editUser(user)}
          onColumnClick={(column) =>
            sortUnverifiedUsers(column, unverifiedUsersColumns)
          }
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
    setUser(user);
    setIsModalOpen(true);;
  };

  return (
    <div>
      <div className="flex flex-1 flex-row justify-between items-center pb-4">
        <div className="flex flex-row items-center">
          <h1 className="text-xl font-bold">User List</h1>
          <div className="flex flex-row items-center ml-5 space-x-4">
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
        <div className="flex flex-row items-center space-x-4">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            label="search user"
          />
        </div>
      </div>
      {initialTabs.map((tab) => {
        if (tab.value === active) {
          return tab.content;
        }
        return null;
      })}
      {/* <DataTable
        data={filteredVerifiedUser}
        columns={verifiedUsersColumns}
        actions={[]}
        onRowClick={(user) => editUser(user)}
        onColumnClick={(column) =>
          sortVerifiedUsers(column, verifiedUsersColumns)
        }
        // renderCell={renderInvoiceCell}
        showId
      /> */}
      {/* <Tabs tabs={tabs} searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
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
