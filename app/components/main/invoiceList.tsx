"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Invoice } from "@/lib/models/invoice";

interface InvoicesProps {
  invoices?: Invoice[];
}

export const InvoiceList: React.FC<InvoicesProps> = ({ invoices }) => {
  const router = useRouter();

  const handleOnClick = (id: string) => {
    router.push(`/invoices/${id}`);
  };

  return (
    <div>
      <span className="flex text-lg font-normal mb-2">Invoice Generated</span>
      <div className="bg-white p-4 w-full border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex flex-col">
          {(!invoices || invoices.length === 0) && (
            <h1 className="text-center font-normal text-gray-500">
              No Invoice Found
            </h1>
          )}
          {invoices?.map((invoice, index) => (
            <div key={invoice.id} className="mb-4 last:mb-0">
              <div className="flex items-start gap-4">
                <div className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => handleOnClick(invoice?.id ?? "")}
                    className="text-md font-semibold hover:underline hover:text-red-700 text-left"
                  >
                    {invoice.id ?? "Unknown Invoice"}
                  </button>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    Hello there I am just bombing whatever to test out whether
                    this thing is working or not
                  </p>
                </div>
              </div>
              {index < invoices.length - 1 && (
                <div className="my-2 border-b border-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
