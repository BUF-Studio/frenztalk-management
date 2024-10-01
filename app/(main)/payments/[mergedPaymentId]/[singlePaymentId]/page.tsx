"use client";

import { usePayments } from "@/lib/context/collection/paymentContext";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { usePaymentPage } from "@/lib/context/page/paymentPageContext";
import type { Student } from "@/lib/models/student";
import type { Subject } from "@/lib/models/subject";
import type { Tuition } from "@/lib/models/tuition";
import type { Tutor } from "@/lib/models/tutor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import paymentPDF from "@/lib/pdf/html2pdf";
import dynamic from "next/dynamic";
import { ArrowBackIosNew } from "@mui/icons-material";
import PaymentTemplate from "@/lib/pdf/paymentTempate";
import { Payment } from "@/lib/models/payment";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

export default function SinglePaymentDetail({ params }: { params: { singlePaymentId: string } }) {
  const [ payment, setPayment ] = useState<Payment | null>(null);
  const { payments } = usePayments();

  const router = useRouter();

  useEffect(() => {
    if (payment === null || payment.id !== params.singlePaymentId) {
      const foundPayment = payments.find((s) => s.id === params.singlePaymentId);
      if (foundPayment) setPayment(foundPayment);
    }
  }, [params, payment, payments, setPayment]);

  return (
    <div>
      <button
        type="button"
        onClick={(e) => {
          router.back();
        }}
        className="flex items-center text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 transition-colors mb-4"
      >
        <ArrowBackIosNew className="h-5 w-5 mr-2" />
        <h1 className="text-lg font-semibold">Single payment Details</h1>
      </button>

      <div className="bg-white w-fit border-1 border-grey-600 rounded-lg overflow-hidden">
        <PaymentTemplate payment={payment}/>
      </div>
    </div>
  );
}
