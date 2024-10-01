"use client";

import { Badge } from "@/app/components/ui/badge";
import { Checkbox } from "@/app/components/ui/checkbox";
import { DataTableColumnHeader } from "@/app/components/ui/data-table/column-header";
import { useTutors } from "@/lib/context/collection/tutorContext";
import type { MergeInvoice } from "@/lib/models/mergeInvoice";
import type { MergePayment } from "@/lib/models/mergePayment";
import { capitalizeFirstLetter } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<MergePayment>[] = [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
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
    accessorKey: "tutorId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tutor" />
    ),
    cell: ({ row }) => {
      const { tutors } = useTutors();
      const tutor = ( id: string) => tutors.find((t) => t.id === id);
        const tutorId: string = row.getValue("tutorId");
        return (
          <span>
            {tutor(tutorId)?.name}
          </span>
        );
      },
  },
  {
    accessorKey: "month",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Month" />
    ),
  },
  {
    accessorKey: "rate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rate" />
    ),
    cell: ({ row }) => {
      const currency: string = row.getValue("currency");
      const rate: number = row.getValue("rate");
      return (
        <span>
          {currency} {rate.toFixed(2)}
        </span>
      );
    },
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
          case "paid":
            return "default";
          case "pending":
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
