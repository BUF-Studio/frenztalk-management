import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Invoice } from "../../models/invoice";
import { invoicesStream } from "@/lib/firebase/invoice";

type InvoicesContextType = {
    invoices: Invoice[];
    filteredInvoices: Invoice[];
    unpaidInvoices: Invoice[];
    totalReceiveRate: Number;
    totalUnreceiveRate: Number;
    month: string;
    setMonth: (month: string) => void;

};

const initialContext: InvoicesContextType = {
    invoices: [],
    filteredInvoices: [],
    unpaidInvoices: [],
    totalReceiveRate: 0,
    totalUnreceiveRate: 0,
    month: '',
    setMonth: () => { },
};
// Create a context to hold the data
const InvoicesContext = createContext<InvoicesContextType>(initialContext);

export const useInvoices = () => useContext(InvoicesContext);

function InvoicesProvider({ children }: ScriptProps) {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [filteredInvoices, setFilterInvoices] = useState<Invoice[]>([]);
    const [unpaidInvoices, setUnpaidInvoices] = useState<Invoice[]>([]);
    const [totalReceiveRate, setTotalReceiveRate] = useState<Number>(0);
    const [totalUnreceiveRate, setTotalUnreceiveRate] = useState<Number>(0);
    const [month, setMonth] = useState<string>('');

    // Fetch data from Firebase and set up listeners
    useEffect(() => {
        const onUpdate = (invoices: Invoice[]) => {
            console.log(invoices);
            setInvoices(invoices);

        };
        const unsubscribe = invoicesStream(onUpdate);

        return () => unsubscribe();
    }, []);


    // example month = '2024-09';

    useEffect(() => {
        const filteredInvoices = month !== ''
            ? invoices.filter(invoice => invoice.startDateTime.startsWith(month))
            : invoices;
        setFilterInvoices(filteredInvoices)

        const unpaidInvoice = filteredInvoices.filter(invoice => invoice.status !== 'paid' && invoice.status !== 'cancel');
        setUnpaidInvoices(unpaidInvoice);

        const totalReceiveRate = filteredInvoices
            .filter(invoice => invoice.status === 'paid')
            .reduce((sum, invoice) => sum + invoice.rate, 0);
        setTotalReceiveRate(totalReceiveRate);

        const totalUnreceiveRate = filteredInvoices
            .filter(invoice => invoice.status === 'pending')
            .reduce((sum, invoice) => sum + invoice.rate, 0);
        setTotalUnreceiveRate(totalUnreceiveRate);
    }, [invoices, month]);

    return (
        <InvoicesContext.Provider value={{ invoices, filteredInvoices, unpaidInvoices, totalReceiveRate, totalUnreceiveRate, month, setMonth }}>
            {children}
        </InvoicesContext.Provider>
    );
}

export default InvoicesProvider;