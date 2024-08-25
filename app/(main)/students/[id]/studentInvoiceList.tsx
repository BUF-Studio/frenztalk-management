"use client";

import { useStudents } from "@/lib/context/collection/studentsContext";
import { useInvoices } from "@/lib/context/collection/invoiceContext";
import { useStudentPage } from "@/lib/context/page/studentPageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudentInvoiceList() {
  const { invoices } = useInvoices();
  const { studentInvoice } = useStudentPage();
  const router = useRouter();

  const handleOnClick = (id: string) => {
    router.push(`/invoices/${id}`);
  };

  return (
    <div>
      <span className="flex text-lg font-normal mb-2">Invoice</span>
      <div className="bg-white p-4 w-full border-1 border-grey-600 rounded-lg overflow-hidden">
        <div className="flex flex-col justify-between items-center">
          {studentInvoice.length === 0 && (
              <h1 className="flex justify-center font-normal text-gray-500">
                No Invoice Found
              </h1>
          )}
          {studentInvoice.map((invoice, index) => (
            <div key={invoice.id}>
              <div className="flex flex-row gap-2 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  {/* If you have an image, you can add it here */}
                  {/* <img src={tutor.avatarUrl} alt={tutor.name} className="w-full h-full object-cover" /> */}
                </div>
                <div className="flex flex-col items-start">
                  <button
                    type="button"
                    onClick={() => {
                      handleOnClick(invoice.id ?? "");
                    }}
                    className="text-md font-semibold hover:underline hover:text-red-700"
                  >
                    {invoice.subjectId}
                  </button>
                </div>
              </div>
              {index < studentInvoice.length - 1 && (
                <div className="border-b border-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
