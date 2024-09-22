

"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addPayment, updatePayment } from '@/lib/firebase/payment';
import { Payment } from '@/lib/models/payment';
import { Subject } from '@/lib/models/subject';
import { Tutor } from '@/lib/models/tutor';
import { Student } from '@/lib/models/student';
import { Tuition } from '@/lib/models/tuition';
import { useTuitions } from '@/lib/context/collection/tuitionContext';
import { useStudents } from '@/lib/context/collection/studentsContext';
import { useSubjects } from '@/lib/context/collection/subjectContext';
import Currency from '@/lib/models/currency';
import { Timestamp } from 'firebase/firestore';
import { InvoiceStatus } from '@/lib/models/invoiceStatus';
import { usePaymentPage } from '@/lib/context/page/paymentPageContext';
import { useTutors } from '@/lib/context/collection/tutorContext';

export default function PaymentForm() {
    const router = useRouter();
    const { payment, setPayment } = usePaymentPage();

    const { tuitions } = useTuitions();
    const { students } = useStudents();
    const { tutors } = useTutors();
    const { subjects } = useSubjects();

    const tuition: Tuition | undefined = tuitions.find(tuition => tuition.id === payment?.tuitionId)
    const student: Student | undefined = students.find(student => student.id === payment?.studentId)
    const tutor: Tutor | undefined = tutors.find(tutor => tutor.id === payment?.tutorId)
    const subject: Subject | undefined = subjects.find(subject => subject.id === payment?.subjectId)

    const [startDateTime, setStartDateTime] = useState(tuition?.startTime?.slice(0, 16) || '');
    const [duration, setDuration] = useState(tuition?.duration || 1);

    const [status, setStatus] = useState<InvoiceStatus>(payment!.status);

    const [currency, setCurrency] = useState(payment!.currency);
    const [price, setPrice] = useState(payment!.price);
    const [rate, setRate] = useState(payment!.rate || (payment!.price * payment!.duration) || 0);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();



        try {
            const startTimestamp = new Date(startDateTime);
            const zoomStartTime = startTimestamp.toISOString().replace('Z', '+08:00');

            console.log('duration')
            console.log(duration)


            const updatedPayment = new Payment(
                payment!.id,
                payment!.tuitionId,
                payment!.tutorId,
                payment!.studentId,
                payment!.subjectId,
                rate,
                status,
                zoomStartTime,
                duration,
                currency,
                price,

            );
            await updatePayment(updatedPayment)

            setPayment(updatedPayment)


            router.back()

        } catch (error) {
            console.error("Failed to submit the form", error);
        }
    };



    return (
        <form onSubmit={handleSubmit}>
            <p>Id: {payment!.id}</p>
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
                        const pri = Number(e.target.value)
                        setPrice(pri)
                        setRate(pri * duration / 60)

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
                <label htmlFor="duration">Duration ( minutes ):</label>
                <input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => {
                        const dur = Number(e.target.value)
                        setDuration(dur)
                        setRate(price * dur / 60)
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