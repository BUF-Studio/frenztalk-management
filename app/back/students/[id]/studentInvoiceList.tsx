"use client";

import { useStudents } from '@/lib/context/collection/studentsContext';
import { useInvoices } from '@/lib/context/collection/invoiceContext';
import { useStudentPage } from '@/lib/context/page/studentPageContext';
import Link from 'next/link';



export default function StudentInvoiceList() {
    const { invoices } = useInvoices();
    const { studentInvoice } = useStudentPage();

   

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
                        {invoice.rate}
                    </li>
                ))}
            </ul>
        </div>
    );
}