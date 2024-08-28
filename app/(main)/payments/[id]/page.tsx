"use client";

import { usePayments } from "@/lib/context/collection/paymentContext";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import type { Payment } from "@/lib/models/payment";
import type { Student } from "@/lib/models/student";
import type { Subject } from "@/lib/models/subject";
import type { Tuition } from "@/lib/models/tuition";
import type { Tutor } from "@/lib/models/tutor";
import generatePDF from "@/lib/pdf/pdf";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import PaymentPDF from "@/lib/pdf/html2pdf";
import dynamic from "next/dynamic";
import { ArrowBackIosNew } from "@mui/icons-material";
import InvoicePDF from "@/lib/pdf/invoicePDF";
import { usePaymentPage } from "@/lib/context/page/paymentPageContext";

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

export default function PaymentDetail({ params }: { params: { id: string } }) {
  const { payment, setPayment } = usePaymentPage();
  const { payments } = usePayments();
  const { tuitions } = useTuitions();
  const { students } = useStudents();
  const { tutors } = useTutors();
  const { subjects } = useSubjects();

  const router = useRouter();

  const tuition: Tuition | undefined = tuitions.find(
    (tuition) => tuition.id === payment?.tuitionId
  );
  const student: Student | undefined = students.find(
    (student) => student.id === payment?.studentId
  );
  const tutor: Tutor | undefined = tutors.find(
    (tutor) => tutor.id === payment?.tutorId
  );
  const subject: Subject | undefined = subjects.find(
    (subject) => subject.id === payment?.subjectId
  );

  useEffect(() => {
    if (payment === null || payment.id !== params.id) {
      const foundPayment = payments.find((s) => s.id === params.id);
      if (foundPayment) setPayment(foundPayment);
    }
  }, [params, payment, payments]);

  const handleGeneratePDF = (payment: Payment | null) => {
    generatePDF(payment);
  };

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
        <h1 className="text-lg font-semibold">Tutor Details</h1>
      </button>

      <div className="bg-white w-fit border-1 border-grey-600 rounded-lg overflow-hidden">
        <InvoicePDF invoice={payment}/>
      </div>
    </div>
  );
}
