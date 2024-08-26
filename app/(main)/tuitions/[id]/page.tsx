"use client";

import { InvoiceList } from "@/app/components/main/invoiceList";
import { TutorList } from "@/app/components/main/tutorList";
import { type Step, Stepper } from "@/app/components/ui/stepper";
import { useInvoices } from "@/lib/context/collection/invoiceContext";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { useInvoicePage } from "@/lib/context/page/invoicePageContext";
import { useTuitionPage } from "@/lib/context/page/tuitionPageContext";
import type { Invoice } from "@/lib/models/invoice";
import type { Tutor } from "@/lib/models/tutor";
import { formatDate, formatTimeRange } from "@/utils/util";
import {
  AccessTime,
  ArrowBackIosNew,
  CalendarToday,
} from "@mui/icons-material";
import { Check, Copy, CreditCard, FileText, Pencil, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TuitionDetail({ params }: { params: { id: string } }) {
  const { tuition, setTuition } = useTuitionPage();
  const { invoice, setInvoice } = useInvoicePage();
  const { tuitions } = useTuitions();
  const { invoices } = useInvoices();
  const router = useRouter();
  const { tutors } = useTutors();
  const { students } = useStudents();
  const [isCopied, setIsCopied] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(tuition?.url ?? "");
        setIsCopied(true);
        showSnackbar("Meeting link copied to clipboard", "success");
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  useEffect(() => {
    if (tuition === null || tuition.id !== params.id) {
      const foundTuition = tuitions.find((s) => s.id === params.id);
      if (foundTuition) setTuition(foundTuition);
    }
  }, [params, tuition, tuitions, setTuition]);

  const viewInvoice = (invoiceId: string) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    setInvoice(invoice ?? null);
    router.push(`/invoices/${invoiceId}`);
  };

  const findTutor = (id: string): Tutor | undefined => {
    const tutor = tutors.find((tutor) => tutor.id === id);
    return tutor ?? undefined;
  };

  const findInvoice = (id: string): Invoice | undefined => {
    const invoice = invoices.find((invoice) => invoice.id === id);
    return invoice ?? undefined;
  };

  const findStudent = (id: string) => {
    const student = students.find((student) => student.id === id);
    return student ?? undefined;
  };

  const steps: Step[] = [
    {
      title: "Registered",
      description: "Enter your personal details",
      icon: <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />,
      status: "completed",
    },
    {
      title: "Meeting",
      description: "Set up your account",
      icon: <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400" />,
      status: "current",
      link: tuition?.url,
    },
    {
      title: "Payment",
      description: "Review your information",
      icon: <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />,
      status: "upcoming",
    },
  ];

  return (
    <div className="p-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={(e) => {
          router.back();
        }}
        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
      >
        <ArrowBackIosNew className="h-5 w-5 mr-2" />
        <h1 className="text-lg font-semibold">Class Details</h1>
      </button>

      {/* Class Details Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-1">
                <div className="text-lg font-medium">
                  {tuition?.name.toUpperCase()}
                </div>
                <p className="text-gray-500 text-sm">STPM</p>
              </div>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                Active
              </span>
              <button
                type="button"
                onClick={() => console.log(`${tuition?.id} is pressed.`)}
                className="ml-2 p-2 text-gray-700 hover:text-gray-500 focus:outline-none"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center">
              {/* Registered student */}
              <span className="text-sm">Enrolled by </span>
              <Link
                type="button"
                className="text-sm font-medium ml-1"
                href={`/students/${tuition?.studentId}`}
              >
                {findStudent(tuition?.studentId ?? "")?.name}
              </Link>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center text-gray-500 text-sm">
                <CalendarToday className="h-4 w-4 mr-2" />
                {formatDate(tuition?.startTime)}
              </span>
              <span className="flex items-center text-gray-500 text-sm">
                <AccessTime className="h-4 w-4 mr-2" />
                {formatTimeRange(tuition?.startTime, tuition?.duration)}
              </span>
            </div>
          </div>
          <Stepper steps={steps} />
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Side */}
        <div className="flex-grow">
          <div className="mb-2">
            <h1 className="text-lg font-normal">Classes</h1>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex  justify-between items-center">
              <span className="text-sm font-medium text-gray-900">
                Meeting Link
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center text-left text-gray-400 hover:text-gray-600 transition-colors"
                title={isCopied ? "Copied!" : "Copy to clipboard"}
              >
                <span className="mr-2 text-sm">Copy meeting link</span>
                {isCopied ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
            <div className="flex  justify-between items-center">
              <span className="text-sm font-medium text-gray-900">
                Student Price
              </span>
              <span className="text-sm">{tuition?.currency} {tuition?.studentPrice}</span>
            </div>
            <div className="flex  justify-between items-center">
              <span className="text-sm font-medium text-gray-900">
                Tutor Price
              </span>
              <span className="text-sm">{tuition?.currency} {tuition?.tutorPrice}</span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:w-[300px] flex-shrink-0 flex flex-col gap-4">
          <TutorList
            tutors={[findTutor(tuition?.tutorId ?? "") || ({} as Tutor)]}
          />
          <InvoiceList
            invoices={[
              findInvoice(tuition?.studentInvoiceId ?? "") || ({} as Invoice),
            ]}
          />
        </div>
      </div>
    </div>
  );
}
