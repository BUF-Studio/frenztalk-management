import { paymentsStream } from "@/lib/firebase/payment";
import type { Payment } from "@/lib/models/payment";
import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, type ReactNode, useContext, useEffect, useState } from "react";

type PaymentsContextType = {
  payments: Payment[];
};

const initialContext: PaymentsContextType = {
  payments: [],
};
// Create a context to hold the data
const PaymentsContext = createContext<PaymentsContextType>(initialContext);

export const usePayments = () => useContext(PaymentsContext);

type PaymentsProviderProps = {
  children: ReactNode;
  tutorId?: string | null;
};

function PaymentsProvider({ children, tutorId }: PaymentsProviderProps) {
  const [payments, setPayments] = useState<Payment[]>([]);

  // Fetch data from Firebase and set up listeners
  useEffect(() => {
    const onUpdate = (payments: Payment[]) => {
      console.log(payments);
      setPayments(payments);
    };
    const unsubscribe = paymentsStream(onUpdate, tutorId);

    return () => unsubscribe();
  }, [tutorId]);

  return (
    <PaymentsContext.Provider value={{ payments }}>
      {children}
    </PaymentsContext.Provider>
  );
}

export default PaymentsProvider;
