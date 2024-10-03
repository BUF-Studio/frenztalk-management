"use client";

import { Badge } from "@/app/components/general/badge";
import { Checkbox } from "@/app/components/ui/checkbox";
import { DataTableColumnHeader } from "@/app/components/ui/data-table/column-header";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip";
import type { Tutor } from "@/lib/models/tutor";
import { capitalizeFirstLetter } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const columns: ColumnDef<Tutor>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const pic: string = row.getValue("pic");
      const name: string = row.getValue("name");
      return (
        <div className="flex items-center">
          {/* TODO: Add profile picture */}
          {/* <Image
            src={pic}
            alt={name}
            width={40}
            height={40}
            className="rounded-full"
          /> */}
          <div>{name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "des",
    header: ({ column }) => <span>Description</span>,
    cell: ({ row }) => {
      const description: string = row.getValue("des");
      const truncatedDescription = truncateText(description, 50);
      const isTruncated = description && truncatedDescription !== description;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="cursor-default">
              <div className="max-w-xs truncate">
              <p className="text-sm text-muted-foreground">{truncatedDescription}</p>
              </div>
            </TooltipTrigger>
            {isTruncated && (
              <TooltipContent>
                <p>{description}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: "subjects",
    header: ({ column }) => <span>Subject</span>,
    cell: ({ row }) => {
      const subjects: string[] = row.getValue("subjects");
      return (
        <div className="flex flex-wrap gap-1">
          {subjects && subjects.length > 0 ? subjects.map((subject) => {
            const truncatedSubject = truncateText(subject, 15);
            const isTruncated = truncatedSubject !== subject;

            return (
              <TooltipProvider key={subject}>
                <Tooltip>
                  <TooltipTrigger className="cursor-default">
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      {subject}
                    </Badge>
                  </TooltipTrigger>
                  {isTruncated && (
                    <TooltipContent>
                      <p>{subject}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          }) : (
            <span>-</span>
          )}
        </div>
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
          case "active":
            return "secondary";
          case "frozen":
            return "destructive";
          default:
            return "destructive";
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
