"use client";

import { useInvoices } from '@/lib/context/collection/invoiceContext';
import { useStudents } from '@/lib/context/collection/studentsContext';
import { useSubjects } from '@/lib/context/collection/subjectContext';
import { useTuitions } from '@/lib/context/collection/tuitionContext';
import { useTutors } from '@/lib/context/collection/tutorContext';
import { useInvoicePage } from '@/lib/context/page/invoicePageContext';
import type { Invoice } from '@/lib/models/invoice';
import type { Student } from '@/lib/models/student';
import type { Subject } from '@/lib/models/subject';
import type { Tuition } from '@/lib/models/tuition';
import type { Tutor } from '@/lib/models/tutor';
import generatePDF from '@/lib/pdf/pdf';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';



export default function InvoiceDetail({ params }: { params: { id: string } }) {
    const { invoice, setInvoice } = useInvoicePage();
    const { invoices } = useInvoices();
    const { tuitions } = useTuitions();
    const { students } = useStudents();
    const { tutors } = useTutors();
    const { subjects } = useSubjects();

    const router = useRouter();

    const tuition: Tuition | undefined = tuitions.find(tuition => tuition.id === invoice?.tuitionId)
    const student: Student | undefined = students.find(student => student.id === invoice?.studentId)
    const tutor: Tutor | undefined = tutors.find(tutor => tutor.id === invoice?.tutorId)
    const subject: Subject | undefined = subjects.find(subject => subject.id === invoice?.subjectId)

    useEffect(() => {
        if (invoice === null || invoice.id !== params.id) {
          const foundInvoice = invoices.find((s) => s.id === params.id);
          if (foundInvoice) setInvoice(foundInvoice);
        }
      }, [params, invoice, invoices, setInvoice]);

    const handleGeneratePDF = (invoice: Invoice | null) => {
        generatePDF(invoice);
    }


    return (
        <div>

            <button type="button" onClick={(e) => { router.back() }}>Back</button>


            <div>
                <h1>Invoice Details</h1>
                <p>Id: {invoice?.id}</p>
                <p>Type: {invoice?.invoiceType}</p>
                <p>Student Name: {student?.name}</p>
                <p>Tutor Name: {tutor?.name}</p>
                <p>Subject Name: {subject?.name}</p>
                <p>Status: {invoice?.status}</p>
                <p>Date Time: {tuition?.startTime}</p>
                <p>Duration: {tuition?.duration}</p>
                <p>Currency: {tuition?.currency}</p>
                <p>Rate: {invoice?.rate}</p>
                <Link href={`/back/invoices/${invoice?.id}/edit`}>
                    <button type='button'>Edit</button>
                </Link>

            </div>

            <button type="button" onClick={(e) => handleGeneratePDF(invoice)}>
                Download Invoice
            </button>


        </div>

    );
}