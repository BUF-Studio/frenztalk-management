"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Invoice } from "@/lib/models/invoice";
import { Badge, type BadgeProps } from "../general/badge";
import { useEffect, useState } from "react";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { Student } from "@/lib/models/student";
import { capitalizeFirstLetter } from "@/lib/utils";

interface InvoicesProps {
  invoices?: Invoice[];
  studentId: string;
}

export const InvoiceList: React.FC<InvoicesProps> = ({ invoices, studentId }) => {
  const router = useRouter();
  const { students } = useStudents();
  const [student, setStudent] = useState<Student>()

  if (!invoices || invoices?.length === 0) {
    return (
      <></>
    );
  }



  const handleOnClick = (id: string) => {
    router.push(`/invoices/${id}`);
  };



  const renderInvoice = (invoice: Invoice, index: number) => {
    return (
      <div key={invoice.id} className="flex flex-col ">
        <div className="flex items-start justify-between">
          {/* Left side: Student Name and Date */}
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => handleOnClick(invoice?.id ?? "")}
              className="text-sm font-medium hover:underline hover:text-red-700 dark:hover:text-red-500 text-left dark:text-neutral-100"
            >
              {student?.name}
            </button>
            <p className="text-sm text-gray-600 dark:text-neutral-400">
              {new Date(invoice.startDateTime).toDateString()}
            </p>
          </div>

          {/* Right side: Status and Amount */}
          <div className="flex flex-col items-end gap-2">
            <p className="text-sm font-semibold dark:text-neutral-200">
              {`
              ${invoice.currency} ${invoice.rate?.toFixed(2) ?? "0.00"}
              `}
            </p>
            <Badge variant={getStatusVariant(invoice.status)}>
              {capitalizeFirstLetter(invoice.status)}
            </Badge>
          </div>
        </div>
        {index < (invoices?.length ?? 0) - 1 && (
          <div className="my-2 border-b border-gray-200 dark:border-neutral-700" />
        )}
      </div>
    );
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


  return (
    <div>
      <span className="flex text-lg font-normal mb-2 dark:text-neutral-200">
        Invoice Generated
      </span>
      <div className="bg-white dark:bg-neutral-800 p-4 w-full border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden">
        <div className="flex flex-col">
          {(!invoices || invoices.length === 0) && (
            <h1 className="text-center font-normal text-gray-500 dark:text-neutral-400">
              No Invoice Found
            </h1>
          )}
          {invoices?.map((invoice, index) => renderInvoice(invoice, index))}
        </div>
      </div>
    </div>
  );
};
