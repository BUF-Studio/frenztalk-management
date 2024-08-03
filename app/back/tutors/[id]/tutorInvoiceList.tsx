"use client";

import { useInvoices } from '@/lib/context/collection/invoiceContext';
import { useTutorPage } from '@/lib/context/page/tutorPageContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function TutorInvoiceList() {
    const { invoices } = useInvoices();
    const { tutorInvoice } = useTutorPage();
    const router = useRouter();


    if (tutorInvoice.length === 0) {
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
                {tutorInvoice.map((invoice) => (
                    <li key={invoice.id}>
                        <button onClick={(e) => {
                            router.push(`/back/invoices/${invoice.id}`)
                        }}>
                            {invoice.rate}
                        </button>

                    </li>
                ))}
            </ul>
        </div>
    );
}