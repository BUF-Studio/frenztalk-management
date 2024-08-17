"use client";

import { DataTable } from "@/app/components/dashboard/DataTable";
import { useInvoices } from "@/lib/context/collection/invoiceContext";
import { useInvoicePage } from "@/lib/context/page/invoicePageContext";
import type { Invoice } from "@/lib/models/invoice";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Badge from "@/app/components/dashboard/Badge";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { formatDateRange, formatTimeRange } from "@/utils/util";

export default function InvoiceList() {
  const { invoices } = useInvoices();
  const router = useRouter();
  const { setInvoice } = useInvoicePage();
  const { students } = useStudents();
  const { tutors } = useTutors();

  const viewInvoice = (invoice: Invoice) => {
    setInvoice(invoice);
    router.push(`/back/invoices/${invoice.id}`);
  };

  const findStudent = (id: string) => {
    const student = students.find((student) => student.id === id);
    return student;
  };

  const findTutor = (id: string) => {
    const tutor = tutors.find((tutor) => tutor.id === id);
    return tutor;
  };

  const columns: { key: keyof Invoice; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "invoiceType", label: "Issuer" },
    { key: "tutorId", label: "Role" },
    { key: "startDateTime", label: "Issue Date" },
    { key: "duration", label: "Due Date" },
    { key: "status", label: "Status" },
    { key: "rate", label: "Rate" },
  ];

  const renderInvoiceCell = (invoice: Invoice, columnKey: keyof Invoice) => {
    if (columnKey === "status") {
      return <Badge status={invoice.status as string} />;
    }
  
    if (columnKey === "invoiceType") {
      return invoice[columnKey] === "tutor"
        ? findTutor(invoice.tutorId)?.name
        : findStudent(invoice.studentId)?.name;
    }
  
    if (columnKey === "tutorId") {
      return invoice.invoiceType;
    }
  
    if (columnKey === "startDateTime") {
      return new Date(invoice[columnKey] as string).toDateString();
    }
  
    if (columnKey === 'duration') {
      return formatDateRange(invoice.startDateTime, invoice.duration);
    }
  
    if (columnKey === "rate") {
      return `${invoice.currency} ${invoice[columnKey]}`;
    }
  
    return invoice[columnKey] as React.ReactNode;
  };

  return (
    <div>
      <div className="flex flex-1 flex-row justify-between pb-4">
        <h1 className="text-xl font-bold">Invoice List</h1>
        <button
          className="flex flex-row items-center px-4 py-2  bg-red-800 text-white text-sm rounded-md font-semibold hover:bg-red-800/[0.8] hover:shadow-lg"
          type="button"
          onClick={() => router.push("/back/invoices/new")}
        >
          <Plus size={16} strokeWidth={3} className="mr-1" />
          Add invoice
        </button>
      </div>
      <DataTable
        data={invoices}
        columns={columns}
        actions={[]}
        onRowClick={(invoice) => viewInvoice(invoice)}
        renderCell={renderInvoiceCell}
        showId
      />
    </div>
  );
}
