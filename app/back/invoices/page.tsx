"use client";

import { useInvoices } from '@/lib/context/collection/invoiceContext';
import Link from 'next/link';



export default function InvoiceList() {
    const { invoices } = useInvoices();



    return (
        <div>


            <h1> Invoice List</h1>
            <ul>
                {invoices.map((invoice) => (
                    <li key={invoice.id}>
                        <Link href={`/back/invoices/${invoice.id}`}>
                            {invoice.id}
                        </Link>
                    </li>
                ))}
            </ul>


        </div>
    );
}