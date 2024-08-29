"use client";

import { DataTable } from "@/app/components/dashboard/DataTable";
import type { Payment } from "@/lib/models/payment";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge, type BadgeProps } from "@/app/components/general/badge";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import {
  capitalizeFirstLetter,
  formatDateRange,
} from "@/utils/util";
import { usePayments } from "@/lib/context/collection/paymentContext";
import { usePaymentPage } from "@/lib/context/page/paymentPageContext";
import { useState } from "react";
import { useTableColumn } from "@/lib/general_hooks/useTableColumn";
import { TableOrderEnum } from "@/lib/enums/TableOrderEnum";

export default function PaymentList() {
  const { payments } = usePayments();
  const router = useRouter();
  const { setPayment } = usePaymentPage();
  const { students } = useStudents();
  const { tutors } = useTutors();

  const viewPayment = (payment: Payment) => {
    setPayment(payment);
    router.push(`/payments/${payment.id}`);
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

  const initialColumns: { key: keyof Payment; label: string; order: string }[] =
    [
      { key: "id", label: "ID", order: TableOrderEnum.NONE },
      // { key: "paymentType", label: "Issuer" },
      { key: "tutorId", label: "Role", order: TableOrderEnum.NONE },
      { key: "startDateTime", label: "Issue Date", order: TableOrderEnum.NONE },
      { key: "duration", label: "Due Date", order: TableOrderEnum.NONE },
      { key: "status", label: "Status", order: TableOrderEnum.NONE },
      { key: "rate", label: "Rate", order: TableOrderEnum.NONE },
    ];

  const [columns, setColumns] = useState(initialColumns);

  const { sortedData: sortedPayments, sortColumn: sortPaymentByColumn } =
    useTableColumn(payments, columns, setColumns);

  const renderPaymentCell = (payment: Payment, columnKey: keyof Payment) => {
    if (columnKey === "status") {
      return (
        <Badge variant={getStatusVariant(payment.status)}>
          {capitalizeFirstLetter(payment.status as string)}
        </Badge>
      );
    }

    // if (columnKey === "paymentType") {
    //   return payment[columnKey] === "tutor"
    //     ? findTutor(payment.tutorId)?.name
    //     : findStudent(payment.studentId)?.name;
    // }

    // if (columnKey === "tutorId") {
    //   return payment.paymentType;
    // }

    if (columnKey === "startDateTime") {
      return new Date(payment[columnKey] as string).toDateString();
    }

    if (columnKey === "duration") {
      return formatDateRange(payment.startDateTime, payment.duration);
    }

    if (columnKey === "rate") {
      return `${payment.currency} ${payment[columnKey]}`;
    }

    return payment[columnKey] as React.ReactNode;
  };

  return (
    <div>
      <div className="flex flex-1 flex-row justify-between pb-4">
        <h1 className="text-xl font-bold">Payment List</h1>
        <button
          className="flex flex-row items-center px-4 py-2  bg-red-800 text-white text-sm rounded-md font-semibold hover:bg-red-800/[0.8] hover:shadow-lg"
          type="button"
          onClick={() => router.push("/payments/new")}
        >
          <Plus size={16} strokeWidth={3} className="mr-1" />
          Add payment
        </button>
      </div>
      <DataTable
        data={payments}
        columns={columns}
        actions={[]}
        onRowClick={(payment) => viewPayment(payment)}
        onColumnClick={(column) => sortPaymentByColumn(column, columns)}
        renderCell={renderPaymentCell}
        showId
      />
    </div>
  );
}
