"use client";

import { DataTable } from "@/app/components/dashboard/DataTable";
import { Tabs } from "@/app/components/ui/tabs";
import { useUsers } from "@/lib/context/collection/usersContext";
import { useUserPage } from "@/lib/context/page/userPageContext";
import { type User, UserRole } from "@/lib/models/user";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserList() {
  const { verifiedUsers, unverifiedUsers } = useUsers();
  const { setUser } = useUserPage();
  const router = useRouter();

  const columns: { key: keyof User; label: string }[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
  ];

  const tabs = [
    {
      title: "Users",
      value: "users",
      content: (
        <DataTable
          data={verifiedUsers}
          columns={columns}
          actions={[]}
          onRowClick={(user) => editUser(user)}
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
          actions={[]}
          onRowClick={(user) => editUser(user)}
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
