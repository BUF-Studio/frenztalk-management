"use client";

import { useInvoicePage } from "@/lib/context/page/invoicePageContext";
import type { Invoice } from "@/lib/models/invoice";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge, type BadgeProps } from "@/app/components/general/badge";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { capitalizeFirstLetter, formatDateRange } from "@/utils/util";
import { usePayments } from "@/lib/context/collection/paymentContext";
import { useState } from "react";
import { useTableColumn } from "@/lib/general_hooks/useTableColumn";
import { TableOrderEnum } from "@/lib/enums/TableOrderEnum";
import { SearchBar } from "@/app/components/general/input/searchBar";
import { useSearchTableData } from "@/lib/general_hooks/useSearchTableData";
import InvoiceModalDialog from "./components/invoiceModalDialog";
import { useInvoices } from "@/lib/context/collection/invoiceContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { DataTable } from "@/app/components/ui/data-table";
import { columns } from "./columns";
import { useMergeInvoices } from "@/lib/context/collection/mergeInvoiceContext";

export default function InvoiceList() {
  const { invoices } = useInvoices();
  const { payments } = usePayments();
  const router = useRouter();
  // const { invoice, setInvoice } = useInvoicePage();
  const { mergeInvoices } = useMergeInvoices();
  const { students } = useStudents();
  const { tutors } = useTutors();

  const findStudent = (id: string) => {
    const student = students.find((student) => student.id === id);
    return student;
  };

  const findTutor = (id: string) => {
    const tutor = tutors.find((tutor) => tutor.id === id);
    return tutor;
  };

  return (
    <div>
      <div className="flex flex-1 flex-row justify-between items-center pb-4">
        <h1 className="text-xl font-bold">Payment List</h1>
      </div>
      <DataTable
        data={mergeInvoices}
        columns={columns}
        // getRowHref={(invoice) => {
        //   router.push(`/invoices/${invoice.id}`);
        //   setInvoice(invoice);
        // }}
      />
    </div>
  );
}
