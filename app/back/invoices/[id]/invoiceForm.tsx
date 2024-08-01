

"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInvoicePage } from '@/lib/context/page/invoicePageContext';
import { addInvoice, updateInvoice } from '@/lib/firebase/invoice';
import { Invoice } from '@/lib/models/invoice';
import { Subject } from '@/lib/models/subject';
import { Tutor } from '@/lib/models/tutor';
import { Student } from '@/lib/models/student';
import { Tuition } from '@/lib/models/tuition';
import { useTuitions } from '@/lib/context/collection/tuitionContext';
import { useStudents } from '@/lib/context/collection/studentsContext';
import { useTutors } from '@/lib/context/collection/tutorContext';
import { useSubjects } from '@/lib/context/collection/subjectContext';
import InvoiceStatus from '@/lib/models/invoiceStatus';
import Currency from '@/lib/models/currency';
import { Timestamp } from 'firebase/firestore';

export default function InvoiceForm() {
    const router = useRouter();
    const { invoice, setInvoice } = useInvoicePage();

    const { tuitions } = useTuitions();
    const { students } = useStudents();
    const { tutors } = useTutors();
    const { subjects } = useSubjects();

    const tuition: Tuition | undefined = tuitions.find(tuition => tuition.id === invoice?.tuitionId)
    const student: Student | undefined = students.find(student => student.id === invoice?.studentId)
    const tutor: Tutor | undefined = tutors.find(tutor => tutor.id === invoice?.tutorId)
    const subject: Subject | undefined = subjects.find(subject => subject.id === invoice?.subjectId)

    const [startDateTime, setStartDateTime] = useState(tuition?.startTime?.toDate().toISOString().slice(0, 16) || '');
    const [duration, setDuration] = useState(tuition?.duration || 1);

    const [status, setStatus] = useState<InvoiceStatus>(invoice!.status);

    const [currency, setCurrency] = useState(invoice!.currency);
    const [price, setPrice] = useState(invoice!.price );
    const [rate, setRate] = useState(invoice!.rate || (invoice!.price * invoice!.duration) || 0);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();



        try {
            const startTimestamp = Timestamp.fromDate(new Date(startDateTime));


            const updatedInvoice = new Invoice(
                invoice!.id,
                invoice!.tuitionId,
                invoice!.tutorId,
                invoice!.studentId,
                invoice!.subjectId,
                rate,
                status,
                startTimestamp,
                duration,
                currency,
                price

            );
            await updateInvoice(updatedInvoice)

            setInvoice(updatedInvoice)


            router.back()

        } catch (error) {
            console.error("Failed to submit the form", error);
        }
    };

   

    return (
        <form onSubmit={handleSubmit}>
            <p>Id: {invoice!.id}</p>
            <p>Student Name: {student!.name}</p>
            <p>Tutor Name: {tutor!.name}</p>
            <p>Subject Name: {subject!.name}</p>



            <div>
                <label htmlFor="status">Status:</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                >
                    {Object.values(InvoiceStatus).map((statusValue) => (
                        <option key={statusValue} value={statusValue}>
                            {statusValue.charAt(0).toUpperCase() + statusValue.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="currency">Currency:</label>
                <select
                    id="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as Currency)}
                >
                    {Object.values(Currency).map(curr => (
                        <option key={curr} value={curr}>{curr}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="price">Price / hour:</label>
                <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => {
                        setPrice(Number(e.target.value))
                        setRate(price * duration)

                    }}
                />
            </div>

            <div>
                <label htmlFor="startDateTime">Start Date & Time:</label>
                <input
                    type="datetime-local"
                    id="startDateTime"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="duration">Duration ( hour ):</label>
                <input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => {
                        setDuration(Number(e.target.value))
                        setRate(price * duration)
                    }}
                />
            </div>

            <div>
                Final Rate : {rate}
            </div>



            <div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => router.back()}>Cancel</button>
            </div>
        </form>

    );
}