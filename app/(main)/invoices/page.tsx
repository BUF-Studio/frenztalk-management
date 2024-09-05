"use client";

import { DataTable } from "@/app/components/dashboard/DataTable";
import { useInvoices } from "@/lib/context/collection/invoiceContext";
import { useInvoicePage } from "@/lib/context/page/invoicePageContext";
import type { Invoice } from "@/lib/models/invoice";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge, type BadgeProps } from "@/app/components/general/badge";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { capitalizeFirstLetter, formatDateRange } from "@/utils/util";
import { usePayments } from "@/lib/context/collection/paymentContext";
import { useState } from "react";
import { useTableColumn } from "@/lib/general_hooks/useTableColumn";
import { TableOrderEnum } from "@/lib/enums/TableOrderEnum";
import { SearchBar } from "@/app/components/general/input/searchBar";
import { useSearchTableData } from "@/lib/general_hooks/useSearchTableData";
import InvoiceModalDialog from "./components/invoiceModalDialog";

export default function InvoiceList() {
  const { invoices } = useInvoices();
  const { payments } = usePayments();
  const router = useRouter();
  const { invoice, setInvoice } = useInvoicePage();
  const { students } = useStudents();
  const { tutors } = useTutors();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [orderFlag, setOrderFlag] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [columns, setColumns] = useState<
    { key: keyof Invoice; label: string; order: string }[]
  >([
    { key: "id", label: "ID", order: TableOrderEnum.NONE },
    // { key: "invoiceType", label: "Issuer" },
    { key: "tutorId", label: "Role", order: TableOrderEnum.NONE },
    { key: "startDateTime", label: "Issue Date", order: TableOrderEnum.NONE },
    { key: "duration", label: "Due Date", order: TableOrderEnum.NONE },
    { key: "status", label: "Status", order: TableOrderEnum.NONE },
    { key: "rate", label: "Rate", order: TableOrderEnum.NONE },
  ]);

  console.log("rending invoice list");

  const { sortedData: orderedInvoices, sortColumn: sortInvoiceByColumn } =
    useTableColumn(invoices, columns, setColumns);

  const { filteredData: filteredInvoices } = useSearchTableData(
    orderedInvoices,
    searchTerm
  );

  const viewInvoice = (invoice: Invoice) => {
    setInvoice(invoice);
    router.push(`/invoices/${invoice.id}`);
  };

  const findStudent = (id: string) => {
    const student = students.find((student) => student.id === id);
    return student;
  };

  const findTutor = (id: string) => {
    const tutor = tutors.find((tutor) => tutor.id === id);
    return tutor;
  };

  function getStatusVariant(status: string | undefined): BadgeProps["variant"] {
    if (!status) {
      // Handle the case where status is undefined or null
      return "error"; // or any appropriate fallback value
    }

    switch (status.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "info";
      case "cancel":
        return "warning";
      // Add other cases as needed
      default:
        return "error"; // Handle unexpected statuses
    }
  }

  const renderInvoiceCell = (invoice: Invoice, columnKey: keyof Invoice) => {
    if (columnKey === "status") {
      return (
        <Badge variant={getStatusVariant(invoice.status)}>
          {capitalizeFirstLetter(invoice.status as string)}
        </Badge>
      );
    }

    // if (columnKey === "invoiceType") {
    //   return invoice[columnKey] === "tutor"
    //     ? findTutor(invoice.tutorId)?.name
    //     : findStudent(invoice.studentId)?.name;
    // }

    // if (columnKey === "tutorId") {
    //   return invoice.invoiceType;
    // }

    if (columnKey === "startDateTime") {
      return new Date(invoice[columnKey] as string).toDateString();
    }

    if (columnKey === "duration") {
      return formatDateRange(invoice.startDateTime, invoice.duration);
    }

    if (columnKey === "rate") {
      return `${invoice.currency} ${invoice[columnKey]}`;
    }

    return invoice[columnKey] as React.ReactNode;
  };

  function handleAdd(): void {
    setIsModalOpen(true);
  }

  return (
    <div>
      <div className="flex flex-1 flex-row justify-between items-center pb-4">
        <h1 className="text-xl font-bold">Payment List</h1>
        <div className="flex flex-row items-center space-x-4">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            label="search invoice"
          />
          <button
            className="flex flex-row items-center w-full px-3 py-2 bg-red-800 text-white text-sm rounded-md font-semibold hover:bg-red-800/[0.8] hover:shadow-lg"
            type="button"
            onClick={handleAdd}
          >
            <Plus size={16} strokeWidth={3} className="mr-1" />
            Add invoice
          </button>
        </div>
      </div>
      <DataTable
        data={filteredInvoices}
        columns={columns}
        actions={[]}
        onRowClick={(invoice) => viewInvoice(invoice)}
        onColumnClick={(column) => sortInvoiceByColumn(column, columns)}
        renderCell={renderInvoiceCell}
        showId
      />
      <InvoiceModalDialog
        isOpen={isModalOpen}
        onClose={() => {
          // setTuition(null)
          setIsModalOpen(false);
        }}
        invoice={invoice}
        setInvoice={setInvoice}
      />
    </div>
  );
}
