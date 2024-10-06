"use client";

import { usePayments } from "@/lib/context/collection/paymentContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ArrowBackIosNew } from "@mui/icons-material";
import PaymentTemplate from "@/lib/pdf/paymentTemplate";
import { Payment } from "@/lib/models/payment";

export default function SinglePaymentDetail({ params }: { params: { singlePaymentId: string } }) {
  const [ payment, setPayment ] = useState<Payment | null>(null);
  const { payments } = usePayments();

  const router = useRouter();

  useEffect(() => {
    if (payment === null || payment.id !== params.singlePaymentId) {
      const foundPayment = payments.find((s) => s.id === params.singlePaymentId);
      if (foundPayment) setPayment(foundPayment);
      console.log(foundPayment);
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
        <h1 className="text-lg font-semibold">Single Payment Details</h1>
      </button>

      <div className=" w-fit border-1 border-grey-600 rounded-lg overflow-hidden">
        <PaymentTemplate initialPayment={payment}/>
      </div>
    </div>
  );
}
