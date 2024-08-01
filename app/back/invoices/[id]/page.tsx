"use client";

import { useInvoices } from '@/lib/context/collection/invoiceContext';
import { useStudents } from '@/lib/context/collection/studentsContext';
import { useSubjects } from '@/lib/context/collection/subjectContext';
import { useTuitions } from '@/lib/context/collection/tuitionContext';
import { useTutors } from '@/lib/context/collection/tutorContext';
import { useInvoicePage } from '@/lib/context/page/invoicePageContext';
import { Student } from '@/lib/models/student';
import { Subject } from '@/lib/models/subject';
import { Tuition } from '@/lib/models/tuition';
import { Tutor } from '@/lib/models/tutor';
import Link from 'next/link';



export default function InvoiceDetail({ params }: { params: { id: string } }) {
    const { invoice, setInvoice } = useInvoicePage();
    const { invoices } = useInvoices();
    const { tuitions } = useTuitions();
    const { students } = useStudents();
    const { tutors } = useTutors();
    const { subjects } = useSubjects();

    const tuition :Tuition | undefined= tuitions.find((tuition)=> {tuition.id === invoice?.tuitionId})
    const student :Student | undefined = students.find((student)=> {student.id === invoice?.studentId})
    const tutor :Tutor | undefined= tutors.find((tutor)=> {tutor.id === invoice?.tutorId})
    const subject:Subject | undefined = subjects.find((subject)=> {subject.id === invoice?.subjectId})

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
                <p>Id: {invoice.id}</p>
                <p>Student Name: {student!.name}</p>
                <p>Tutor Name: {tutor!.name}</p>
                <p>Subject Name: {subject!.name}</p>
                <p>Status: {invoice.status}</p>
                <p>Date Time: {tuition!.startTime?.toDate().toUTCString()}</p>
                <p>Duration: {tuition!.duration}</p>
                <p>Currency: {tuition!.currency}</p>
                <p>Rate: {invoice.rate}</p>
                <Link href={`/back/invoices/${invoice.id}/edit`}>
                    <button>Edit</button>
                </Link>

            </div>


        </div>

    );
}