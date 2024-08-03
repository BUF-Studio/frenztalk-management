"use client";

import { useStudents } from '@/lib/context/collection/studentsContext';
import { useInvoices } from '@/lib/context/collection/invoiceContext';
import { useStudentPage } from '@/lib/context/page/studentPageContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function StudentInvoiceList() {
    const { invoices } = useInvoices();
    const { studentInvoice } = useStudentPage();
    const router = useRouter();



    if (studentInvoice.length === 0) {
        return (
            <div>
                <h1>No Invoice Found</h1>

            </div>
        );
    }


    return (
        <div>
            <h1>Student Invoice List</h1>
            <ul>
                {studentInvoice.map((invoice) => (

                    <li key={invoice.id}>
                        <button onClick={(e) => {
                            router.push(`/back/invoices/${invoice.id}`)
                        }}>
                            {invoice.id}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}