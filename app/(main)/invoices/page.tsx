"use client";
import { DataTable } from "@/app/components/ui/data-table";
import { useMergeInvoices } from "@/lib/context/collection/mergeInvoiceContext";
import { useRouter } from "next/navigation";
import { Badge } from "@/app/components/ui/badge";
import { Checkbox } from "@/app/components/ui/checkbox";
import { DataTableColumnHeader } from "@/app/components/ui/data-table/column-header";
import { useStudents } from "@/lib/context/collection/studentsContext";
import Currency from "@/lib/models/currency";
import type { MergeInvoice } from "@/lib/models/mergeInvoice";
import type { ColumnDef } from "@tanstack/react-table";


export default function InvoiceList() {

    
  const router = useRouter();
  const { mergeInvoices } = useMergeInvoices();
  const {students} = useStudents();

  const columns: ColumnDef<MergeInvoice>[] = [
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
      accessorKey: "studentId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Student" />
      ),
      cell: ({ row }) => {
        
        const student = (id: string) => students.find((s) => s.id === id);
          const studentId: string = row.getValue("studentId");
          return (
            <span>
              {student(studentId)?.name}
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
      accessorKey: "currency",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Currency" />
      ),
      cell: ({ row }) => {
        const currency: Currency = row.getValue("currency");
        return (
          <span>
            {currency}
          </span>
        );
      },
    },
    {
      accessorKey: "rate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rate" />
      ),
      cell: ({ row }) => {
        // const currency: any = row.getValue("currency");
        const rate: number = row.getValue("rate");
        return (
          <span>
            {rate.toFixed(2)}
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
              return "outline";
            case "pending":
              return "default";
            default:
              return "destructive";
          }
        }
  
        return (
          <Badge variant={getStatusVariant(status)}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex flex-1 flex-row justify-between items-center pb-4">
        <h1 className="text-xl font-bold">Invoice List</h1>
      </div>
      <DataTable
        data={mergeInvoices}
        columns={columns}
        getRowHref={(invoice) => {
          router.push(`/invoices/${invoice.id}`);
        }}
      />
    </div>
  );
}
