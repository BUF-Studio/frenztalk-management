import { paymentsStream } from "@/lib/firebase/payment";
import type { Payment } from "@/lib/models/payment";
import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

type PaymentsContextType = {
    payments: Payment[];
    filteredPayments: Payment[];
    totalPaymentRate: Number;
    month: string;
    setMonth: (month: string) => void;
};

const initialContext: PaymentsContextType = {
    payments: [],
    filteredPayments: [],
    totalPaymentRate: 0,
    month: '',
    setMonth: () => { },
};
// Create a context to hold the data
const PaymentsContext = createContext<PaymentsContextType>(initialContext);

export const usePayments = () => useContext(PaymentsContext);

type PaymentsProviderProps = {
    children: ReactNode;
    tutorId?: string | null;
    // month?: number;
};

function PaymentsProvider({ children, tutorId }: PaymentsProviderProps) {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
    const [totalPaymentRate, setTotalPayments] = useState<Number>(0);
    const [month, setMonth] = useState<string>('');

    // Fetch data from Firebase and set up listeners
    useEffect(() => {
        const onUpdate = (payments: Payment[]) => {
            console.log(payments);
            setPayments(payments);


        };
        const unsubscribe = paymentsStream(onUpdate, tutorId);

        return () => unsubscribe();
    }, [tutorId]);

    // example month = '2024-09';

    useEffect(() => {
        const filteredPayments = month !== ''
            ? payments.filter(payment => payment.startDateTime.startsWith(month))
            : payments;
        setFilteredPayments(filteredPayments)

        const totalPaymentRate = filteredPayments.reduce((sum, payment) => sum + payment.rate, 0);
        setTotalPayments(totalPaymentRate)
    }, [payments, month]);

    return (
        <PaymentsContext.Provider value={{ payments, filteredPayments, totalPaymentRate, month, setMonth }}>
            {children}
        </PaymentsContext.Provider>
    );
}

export default PaymentsProvider;
