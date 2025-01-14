"use client";

import { Badge } from "@/app/components/ui/badge";
import { Checkbox } from "@/app/components/ui/checkbox";
import { DataTableColumnHeader } from "@/app/components/ui/data-table/column-header";
import type { Student } from "@/lib/models/student";
import { capitalizeFirstLetter } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Student>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        onClick={(e)=> e.stopPropagation}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        onClick={(e)=> e.stopPropagation}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Id" />
      ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "age",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      function getStatusVariant(
        status: string | undefined
      ): "default" | "secondary" | "destructive" | "outline" | undefined {
        if (!status) {
          return "destructive";
        }

        switch (status.toLowerCase()) {
          case "active":
            return "default";
          case "frozen":
            return "destructive";
          case "inactive":
            return "destructive";
          default:
            return "outline";
        }
      }

      return (
        <Badge variant={getStatusVariant(status)}>
          {capitalizeFirstLetter(status)}
        </Badge>
      );
    },
  },
];
