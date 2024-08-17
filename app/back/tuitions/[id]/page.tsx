"use client";

import { useInvoices } from "@/lib/context/collection/invoiceContext";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import { useInvoicePage } from "@/lib/context/page/invoicePageContext";
import { useTuitionPage } from "@/lib/context/page/tuitionPageContext";
import { Invoice } from "@/lib/models/invoice";
import { ArrowBackIosNew } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TuitionDetail({ params }: { params: { id: string } }) {
  const { tuition, setTuition } = useTuitionPage();
  const { invoice, setInvoice } = useInvoicePage();
  const { tuitions } = useTuitions();
  const { invoices } = useInvoices();
  const router = useRouter();

  useEffect(() => {
    if (tuition === null || tuition.id !== params.id) {
      const foundTuition = tuitions.find((s) => s.id === params.id);
      if (foundTuition) setTuition(foundTuition);
    }
  }, [params, tuition, tuitions, setTuition]);

  const viewInvoice = (invoiceId: string) => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    setInvoice(invoice ?? null);
    router.push(`/back/invoices/${invoiceId}`);
  };

  return (
    <div>
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

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Side */}
        <div className="flex-grow">
          <div className="bg-white border-1 border-grey-600 rounded-lg p-6 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-row gap-6 items-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  {/* <span className="text-gray-500 text-xl">Avatar</span> */}
                </div>
                <div className="grid grid-row-2">
                  <p className="text-lg font-semibold">{tuition?.name}</p>
                  {/* <p className="text-xs text-gray-600 font-semibolds">{`Aged ${student?.age}`}</p> */}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center mb-2">
            <h1 className="text-lg font-normal">Classes</h1>
          </div>
        </div>
        <div className="lg:w-[300px] flex-shrink-0 flex flex-col gap-4">
          <div>
            <div className="flex flex-1 h-full" />
          </div>
        </div>
        {/* <div>
        <h1>Tuition Details</h1>
        <p>Name: {tuition?.name}</p>

        {tuition?.tutorInvoiceId !== null &&
          tuition?.tutorInvoiceId !== undefined && (
            <div>
              <button
                onClick={(e) => {
                  viewInvoice(tuition.tutorInvoiceId!);
                }}
              >
                View Tutor Invoice
              </button>
            </div>
          )}
        {tuition?.studentInvoiceId !== null &&
          tuition?.studentInvoiceId !== undefined && (
            <div>
              <button
                onClick={(e) => {
                  viewInvoice(tuition.studentInvoiceId!);
                }}
              >
                View Student Invoice
              </button>
            </div>
          )}
        <Link href={`/back/tuitions/${tuition?.id}/edit`}>
          <button>Edit</button>
        </Link>
      </div> */}
      </div>
    </div>
  );
}
