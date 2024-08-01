"use client";

import { useInvoices } from '@/lib/context/collection/invoiceContext';
import { useInvoicePage } from '@/lib/context/page/invoicePageContext';
import { Invoice } from '@/lib/models/invoice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function InvoiceList() {
    const { invoices } = useInvoices();
    const router = useRouter();
    const { setInvoice } = useInvoicePage();

    const viewInvoice = (invoice: Invoice) => {
        setInvoice(invoice)
        router.push(`/back/invoices/${invoice.id}`)
    }

    return (
        <div>


            <h1> Invoice List</h1>
            <ul>
                {invoices.map((invoice) => (
                    <li key={invoice.id}>
                        <button onClick={(e) => viewInvoice(invoice)}>
                            {invoice.id}
                        </button>
                    </li>
                ))}
            </ul>


        </div>
    );
}