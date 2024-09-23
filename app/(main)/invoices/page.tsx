"use client";

import { useStudents } from "@/lib/context/collection/studentsContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { DataTable } from "@/app/components/ui/data-table";
import { columns } from "./columns";
import { useMergeInvoices } from "@/lib/context/collection/mergeInvoiceContext";
import { useRouter } from "next/navigation";

export default function InvoiceList() {
  const router = useRouter();
  // const { setInvoice } = useMergeInvoices();
  const { mergeInvoices } = useMergeInvoices();

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
          // setInvoice(invoice);
        }}
      />
    </div>
  );
}
