import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";
import { MergeInvoice } from "../../models/mergeInvoice";
import { mergeInvoicesStream } from "@/lib/firebase/mergeInvoice";

type MergeInvoicesContextType = {
    mergeInvoices: MergeInvoice[];
    filteredMergeInvoices: MergeInvoice[];
    unpaidMergeInvoices: MergeInvoice[];
    totalReceiveRate: Number;
    totalUnreceiveRate: Number;
    month: string;
    setMonth: (month: string) => void;

};

const initialContext: MergeInvoicesContextType = {
    mergeInvoices: [],
    filteredMergeInvoices: [],
    unpaidMergeInvoices: [],
    totalReceiveRate: 0,
    totalUnreceiveRate: 0,
    month: '',
    setMonth: () => { },
};
// Create a context to hold the data
const MergeInvoicesContext = createContext<MergeInvoicesContextType>(initialContext);

export const useMergeInvoices = () => useContext(MergeInvoicesContext);

function MergeInvoicesProvider({ children }: ScriptProps) {
    const [mergeInvoices, setMergeInvoices] = useState<MergeInvoice[]>([]);
    const [filteredMergeInvoices, setFilterMergeInvoices] = useState<MergeInvoice[]>([]);
    const [unpaidMergeInvoices, setUnpaidMergeInvoices] = useState<MergeInvoice[]>([]);
    const [totalReceiveRate, setTotalReceiveRate] = useState<Number>(0);
    const [totalUnreceiveRate, setTotalUnreceiveRate] = useState<Number>(0);
    const [month, setMonth] = useState<string>('');

    // Fetch data from Firebase and set up listeners
    useEffect(() => {
        const onUpdate = (mergeInvoices: MergeInvoice[]) => {
            console.log(mergeInvoices);
            setMergeInvoices(mergeInvoices);

        };
        const unsubscribe = mergeInvoicesStream(onUpdate);

        return () => unsubscribe();
    }, []);


    // example month = '2024-09';

    useEffect(() => {
        const filteredMergeInvoices = month !== ''
            ? mergeInvoices.filter(mergeInvoice => mergeInvoice.month === month)
            : mergeInvoices;
        setFilterMergeInvoices(filteredMergeInvoices)

        const unpaidMergeInvoice = filteredMergeInvoices.filter(mergeInvoice => mergeInvoice.status !== 'paid');
        setUnpaidMergeInvoices(unpaidMergeInvoice);

        const totalReceiveRate = filteredMergeInvoices
            .filter(mergeInvoice => mergeInvoice.status === 'paid')
            .reduce((sum, mergeInvoice) => sum + mergeInvoice.rate, 0);
        setTotalReceiveRate(totalReceiveRate);

        const totalUnreceiveRate = filteredMergeInvoices
            .filter(mergeInvoice => mergeInvoice.status === 'pending')
            .reduce((sum, mergeInvoice) => sum + mergeInvoice.rate, 0);
        setTotalUnreceiveRate(totalUnreceiveRate);
    }, [mergeInvoices, month]);

    return (
        <MergeInvoicesContext.Provider value={{ mergeInvoices, filteredMergeInvoices, unpaidMergeInvoices, totalReceiveRate, totalUnreceiveRate, month, setMonth }}>
            {children}
        </MergeInvoicesContext.Provider>
    );
}

export default MergeInvoicesProvider;
