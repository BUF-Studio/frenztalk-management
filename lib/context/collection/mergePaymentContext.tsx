import { mergePaymentsStream } from "@/lib/firebase/mergePayment";
import { MergePayment } from "@/lib/models/mergePayment";
import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";

type MergePaymentsContextType = {
    mergePayments: MergePayment[];
    filteredMergePayments: MergePayment[];
    totalPaymentRate: Number;
    month: string;
    setMonth: (month: string) => void;

};

const initialContext: MergePaymentsContextType = {
    mergePayments: [],
    filteredMergePayments: [],
    totalPaymentRate: 0,
    month: '',
    setMonth: () => { },
};
// Create a context to hold the data
const MergePaymentsContext = createContext<MergePaymentsContextType>(initialContext);

type MergePaymentsProviderProps = {
    children: ReactNode;
    tutorId?: string | null;
  };

export const useMergePayments = () => useContext(MergePaymentsContext);

function MergePaymentsProvider({ children , tutorId }: MergePaymentsProviderProps) {
    const [mergePayments, setMergePayments] = useState<MergePayment[]>([]);
    const [filteredMergePayments, setFilterMergePayments] = useState<MergePayment[]>([]);
    const [totalPaymentRate, setTotalReceiveRate] = useState<Number>(0);
    const [month, setMonth] = useState<string>('');

    // Fetch data from Firebase and set up listeners
    useEffect(() => {
        const onUpdate = (mergePayments: MergePayment[]) => {
            console.log(mergePayments);
            setMergePayments(mergePayments);

        };
        const unsubscribe = mergePaymentsStream(onUpdate, tutorId);

        return () => unsubscribe();
    }, []);


    // example month = '2024-09';

    useEffect(() => {
        const filteredMergePayments = month !== ''
            ? mergePayments.filter(mergePayment => mergePayment.month === month)
            : mergePayments;
        setFilterMergePayments(filteredMergePayments)



        const totalPaymentRate = filteredMergePayments
            .filter(mergePayment => mergePayment.status === 'paid')
            .reduce((sum, mergePayment) => sum + mergePayment.rate, 0);
        setTotalReceiveRate(totalPaymentRate);


    }, [mergePayments, month]);

    return (
        <MergePaymentsContext.Provider value={{ mergePayments, filteredMergePayments, totalPaymentRate, month, setMonth }}>
            {children}
        </MergePaymentsContext.Provider>
    );
}

export default MergePaymentsProvider;
