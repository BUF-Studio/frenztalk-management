"use client";

import type { Payment } from "@/lib/models/payment";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge, type BadgeProps } from "@/app/components/general/badge";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { capitalizeFirstLetter, formatDateRange } from "@/utils/util";
import { usePayments } from "@/lib/context/collection/paymentContext";
import { usePaymentPage } from "@/lib/context/page/paymentPageContext";
import { useState } from "react";
import { useTableColumn } from "@/lib/general_hooks/useTableColumn";
import { TableOrderEnum } from "@/lib/enums/TableOrderEnum";
import { useSearchTableData } from "@/lib/general_hooks/useSearchTableData";
import { SearchBar } from "@/app/components/general/input/searchBar";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { DataTable } from "@/app/components/ui/data-table";
import { columns } from "./columns";
import { useMergePayments } from "@/lib/context/collection/mergePaymentContext";

export default function PaymentList() {
  const { mergePayments} = useMergePayments();
  const router = useRouter();
  const { setPayment } = usePaymentPage();
  const { students } = useStudents();
  const { tutors } = useTutors();

  return (
    <div>
      <div className="flex flex-1 flex-row justify-between items-center pb-4">
        <h1 className="text-xl font-bold">Payment List</h1>
      </div>
      <DataTable
        data={mergePayments}
        columns={columns}
        getRowHref={(payment) => {
          router.push(`/payments/${payment.id}`);
          // setInvoice(invoice);
        }}
      />
    </div>
  );
}
