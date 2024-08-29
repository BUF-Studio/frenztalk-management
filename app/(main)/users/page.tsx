"use client";

import { DataTable } from "@/app/components/dashboard/DataTable";
import { Tabs } from "@/app/components/general/tabs";
import { useUsers } from "@/lib/context/collection/usersContext";
import { useUserPage } from "@/lib/context/page/userPageContext";
import { TableOrderEnum } from "@/lib/enums/TableOrderEnum";
import { useTableColumn } from "@/lib/general_hooks/useTableColumn";
import { type User, UserRole } from "@/lib/models/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UserList() {
  const { verifiedUsers, unverifiedUsers } = useUsers();
  const { setUser } = useUserPage();
  const router = useRouter();

  const initialColumns: { key: keyof User; label: string; order: string }[] = [
    { key: "name", label: "Name", order: TableOrderEnum.NONE },
    { key: "email", label: "Email", order: TableOrderEnum.NONE },
    { key: "role", label: "Role", order: TableOrderEnum.NONE },
  ];


  const [verifiedUsersColumns, setVerifiedUsersColumns] = useState(initialColumns);
  const [unverifiedUsersColumns, setUnverifiedUsersColumns] = useState(initialColumns);

  const { sortedData: sortedVerifiedUser, sortColumn: sortVerifiedUsers } =
    useTableColumn(verifiedUsers, verifiedUsersColumns, setVerifiedUsersColumns);

  const { sortedData: sortedUnverifiedUsers, sortColumn: sortUnverifiedUsers } =
    useTableColumn(unverifiedUsers, unverifiedUsersColumns, setUnverifiedUsersColumns);

    const tabs = [
      {
        title: "Users",
        value: "users",
        content: (
          <DataTable
            data={sortedVerifiedUser}
            columns={verifiedUsersColumns}
            actions={[]}
            onRowClick={(user) => editUser(user)}
            onColumnClick={(column) => sortVerifiedUsers(column, verifiedUsersColumns)}
          />
        ),
      },
      {
        title: "Requests",
        value: "request",
        content: (
          <DataTable
            data={sortedUnverifiedUsers}
            columns={unverifiedUsersColumns}
            actions={[]}
            onRowClick={(user) => editUser(user)}
            onColumnClick={(column) => sortUnverifiedUsers(column, unverifiedUsersColumns)}
          />
        ),
        notify: unverifiedUsers.length,
      },
    ];

  const editUser = (user: User) => {
    setUser(user);
    router.push(`/users/${user.id}`);
  };

  return (
    <div>
      <Tabs tabs={tabs} />
    </div>
  );
}
