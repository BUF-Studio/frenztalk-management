import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Invoice } from "../../models/invoice";
import { invoicesStream } from "@/lib/firebase/invoice";

type InvoicesContextType = {
    invoices: Invoice[];
    unpaidInvoices: Invoice[];
    totalReceiveRate: Number;
    totalUnreceiveRate: Number;

};

const initialContext: InvoicesContextType = {
    invoices: [],
    unpaidInvoices: [],
    totalReceiveRate: 0,
    totalUnreceiveRate: 0,
};
// Create a context to hold the data
const InvoicesContext = createContext<InvoicesContextType>(initialContext);

export const useInvoices = () => useContext(InvoicesContext);

function InvoicesProvider({ children }: ScriptProps) {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [unpaidInvoices, setUnpaidInvoices] = useState<Invoice[]>([]);
    const [totalReceiveRate, setTotalReceiveRate] = useState<Number>(0);
    const [totalUnreceiveRate, setTotalUnreceiveRate] = useState<Number>(0);

    // Fetch data from Firebase and set up listeners
    useEffect(() => {
        const onUpdate = (invoices: Invoice[]) => {
            console.log(invoices);
            setInvoices(invoices);
            const unpaidInvoice = invoices
                .filter(invoice => invoice.status !== 'paid')
            setUnpaidInvoices(unpaidInvoice)
            const totalReceiveRate = invoices
                .filter(invoice => invoice.status === 'paid')
                .reduce((sum, invoice) => sum + invoice.rate, 0);
            setTotalReceiveRate(totalReceiveRate)
            const totalUnreceiveRate = invoices
                .filter(invoice => invoice.status === 'pending')
                .reduce((sum, invoice) => sum + invoice.rate, 0);
            setTotalUnreceiveRate(totalUnreceiveRate)

        };
        const unsubscribe = invoicesStream(onUpdate);

        return () => unsubscribe();
    }, []);

    return (
        <InvoicesContext.Provider value={{ invoices, unpaidInvoices, totalReceiveRate, totalUnreceiveRate }}>
            {children}
        </InvoicesContext.Provider>
    );
}

export default InvoicesProvider;
