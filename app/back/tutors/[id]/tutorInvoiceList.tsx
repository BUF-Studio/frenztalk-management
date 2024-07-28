"use client";

import { useInvoices } from '@/lib/context/collection/invoiceContext';
import { useTutorPage } from '@/lib/context/page/tutorPageContext';
import Link from 'next/link';



export default function TutorInvoiceList() {
    const { invoices } = useInvoices();
    const { tutor, setTutor } = useTutorPage();

    const matchingInvoices = invoices.filter(invoice =>
        invoice.tutorId === tutor?.id
    );

    if (matchingInvoices.length === 0) {
        return (
            <div>
                <h1>No Invoice Found</h1>

            </div>
        );
    }


    return (
        <div>
            <h1>Tutor Invoice List</h1>
            <ul>
                {matchingInvoices.map((invoice) => (
                    <li key={invoice.id}>
                        {invoice.rate}
                    </li>
                ))}
            </ul>
        </div>
    );
}