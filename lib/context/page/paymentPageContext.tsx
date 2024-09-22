import type { Payment } from "@/lib/models/payment";
import type { ScriptProps } from "next/script";
import { createContext, useContext, useState } from "react";

type PaymentPageContextType = {
  payment: Payment | null;
  setPayment: (payment: Payment | null) => void;
};

const initialContext: PaymentPageContextType = {
  payment: null,
  setPayment: () => {},
};
// Create a context to hold the data
const PaymentPageContext = createContext<PaymentPageContextType>(initialContext);

export const usePaymentPage = () => useContext(PaymentPageContext);

function PaymentPageProvider({ children }: ScriptProps) {
  const [payment, setPayment] = useState<Payment | null>(null);

  return (
    <PaymentPageContext.Provider value={{ payment, setPayment }}>
      {children}
    </PaymentPageContext.Provider>
  );
}

export default PaymentPageProvider;
