"use client";

import { useInvoices } from '@/lib/context/collection/invoiceContext';
import { useInvoicePage } from '@/lib/context/page/invoicePageContext';
import Link from 'next/link';



export default function InvoiceDetail({ params }: { params: { id: string } }) {
    const { invoice, setInvoice } = useInvoicePage();
    const { invoices } = useInvoices();


    if (invoice === null || invoice.id !== params.id) {
        const foundInvoice = invoices.find(s => s.id === params.id);
        if (foundInvoice)
            setInvoice(foundInvoice);
    }

    if (invoice === null) {
        return (
            <div>
                <h1>Invoice Not Found</h1>
                <Link href="/back/invoices">
                    <button>Back to Invoice List</button>
                </Link>
            </div>
        );
    }


    return (
        <div>
            <Link href="/back/invoices">
                <button>Back to Invoice List</button>
            </Link>

            <div>
                <h1>Invoice Details</h1>
                <p>Name: {invoice.id}</p>
                <Link href={`/back/invoices/${invoice.id}/edit`}>
                    <button>Edit</button>
                </Link>

            </div>


        </div>

    );
}