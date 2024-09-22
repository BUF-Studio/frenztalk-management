import { paymentsStream } from "@/lib/firebase/payment";
import type { Payment } from "@/lib/models/payment";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

type PaymentsContextType = {
    payments: Payment[];
    totalPaymentRate: Number;
};

const initialContext: PaymentsContextType = {
    payments: [],
    totalPaymentRate: 0,
};
// Create a context to hold the data
const PaymentsContext = createContext<PaymentsContextType>(initialContext);

export const usePayments = () => useContext(PaymentsContext);

type PaymentsProviderProps = {
    children: ReactNode;
    tutorId?: string | null;
    month?: number;
};

function PaymentsProvider({ children, tutorId }: PaymentsProviderProps) {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [totalPaymentRate, setTotalPayments] = useState<Number>(0);

    // Fetch data from Firebase and set up listeners
    useEffect(() => {
        const onUpdate = (payments: Payment[]) => {
            console.log(payments);
            setPayments(payments);
            const totalPaymentRate = payments.reduce((sum, payment) => sum + payment.rate, 0);
            setTotalPayments(totalPaymentRate)

        };
        const unsubscribe = paymentsStream(onUpdate, tutorId);

        return () => unsubscribe();
    }, [tutorId]);

    return (
        <PaymentsContext.Provider value={{ payments, totalPaymentRate }}>
            {children}
        </PaymentsContext.Provider>
    );
}

export default PaymentsProvider;
