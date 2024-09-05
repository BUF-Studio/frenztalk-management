"use client";

import type { ColumnDef } from "@tanstack/react-table";

enum StudentStatus {
  ACTIVE = "active",
  FROZEN = "frozen",
}

type Student = {
  id: string;
  name: string;
  age: number;
  status: StudentStatus;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
