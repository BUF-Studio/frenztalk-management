"use client";

import { useInvoices } from "@/lib/context/collection/invoiceContext";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useInvoicePage } from "@/lib/context/page/invoicePageContext";
import type { Student } from "@/lib/models/student";
import type { Subject } from "@/lib/models/subject";
import type { Tuition } from "@/lib/models/tuition";
import type { Tutor } from "@/lib/models/tutor";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import InvoicePDF from "@/lib/pdf/html2pdf";
import dynamic from "next/dynamic";
import { ArrowBackIosNew } from "@mui/icons-material";

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

export default function SingleInvoiceDetail({ params }: { params: { singleInvoiceId: string } }) {
  const { invoice, setInvoice } = useInvoicePage();
  const { invoices } = useInvoices();
  const { tuitions } = useTuitions();
  const { students } = useStudents();
  const { tutors } = useTutors();
  const { subjects } = useSubjects();

  const router = useRouter();

  const tuition: Tuition | undefined = tuitions.find(
    (tuition) => tuition.id === invoice?.tuitionId
  );
  const student: Student | undefined = students.find(
    (student) => student.id === invoice?.studentId
  );
  const tutor: Tutor | undefined = tutors.find(
    (tutor) => tutor.id === invoice?.tutorId
  );
  const subject: Subject | undefined = subjects.find(
    (subject) => subject.id === invoice?.subjectId
  );

  useEffect(() => {
    if (invoice === null || invoice.id !== params.singleInvoiceId) {
      const foundInvoice = invoices.find((s) => s.id === params.singleInvoiceId);
      if (foundInvoice) setInvoice(foundInvoice);
    }
  }, [params, invoice, invoices, setInvoice]);

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
        <h1 className="text-lg font-semibold">Single Invoice Details</h1>
      </button>

      <div className="bg-white w-fit border-1 border-grey-600 rounded-lg overflow-hidden">
        {/* <InvoicePDF invoice={invoice}/> */}
      </div>
    </div>
  );
}
