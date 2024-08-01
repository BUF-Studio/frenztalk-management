

"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTuitionPage } from '@/lib/context/page/tuitionPageContext';
import { addTuition, updateTuition } from '@/lib/firebase/tuition';
import { Tuition } from '@/lib/models/tuition';
import { useStudents } from '@/lib/context/collection/studentsContext';
import { useTutors } from '@/lib/context/collection/tutorContext';
import { useSubjects } from '@/lib/context/collection/subjectContext';
import Currency from '@/lib/models/currency';
import TuitionStatus from '@/lib/models/tuitionStatus';
import { Timestamp } from 'firebase/firestore';
import { Invoice } from '@/lib/models/invoice';
import InvoiceStatus from '@/lib/models/invoiceStatus';
import { addInvoice } from '@/lib/firebase/invoice';

export default function TuitionForm() {
    const router = useRouter();
    const { tuition, student, tutor, subject, setTuition } = useTuitionPage();

    const { students } = useStudents()
    const { tutors } = useTutors()
    const { subjects } = useSubjects()


    const [name, setName] = useState(tuition?.name || '');
    const [studentId, setStudentId] = useState(tuition?.studentId || student?.id || '');
    const [tutorId, setTutorId] = useState(tuition?.tutorId || tutor?.id || '');
    const [subjectId, setSubjectId] = useState(tuition?.subjectId || subject?.id || '');
    const [status, setStatus] = useState(tuition?.status || '');

    const [currency, setCurrency] = useState<Currency>(tuition?.currency || Currency.MYR);
    const [price, setPrice] = useState(tuition?.price || 0);
    const [startDateTime, setStartDateTime] = useState(tuition?.startTime?.toDate().toISOString().slice(0, 16) || '');
    const [duration, setDuration] = useState(tuition?.duration || 1);
    const [repeatWeeks, setRepeatWeeks] = useState(1);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();



        try {



            const startTimestamp = Timestamp.fromDate(new Date(startDateTime));

            if (tuition === null) {
                for (let i = 0; i <= repeatWeeks - 1; i++) {
                    const newStartTimestamp = Timestamp.fromDate(new Date(startTimestamp.toDate().getTime() + (i * 7 * 24 * 60 * 60 * 1000)));
                    const newTuition = new Tuition(
                        null,
                        name,
                        tutorId,
                        studentId,
                        subjectId,
                        status,
                        newStartTimestamp,
                        duration,
                        '',
                        price,
                        currency,
                        null,
                    );
                    await addTuition(newTuition);
                }

            } else {
                let newInvoice: boolean = false
                let iid = tuition.invoiceId;
                if (tuition.status !== TuitionStatus.END && status === TuitionStatus.END && tuition.invoiceId === null) {
                    const rate = price * duration
                    const invoice = new Invoice(
                        null,
                        tuition.id!,
                        tutorId,
                        studentId,
                        subjectId,
                        rate,
                        InvoiceStatus.PENDING,
                        startTimestamp,
                        duration,
                        currency,
                        price,
                    )
                    newInvoice = true

                    iid = await addInvoice(invoice)

                }

                const updatedTuition = new Tuition(
                    tuition.id,
                    name,
                    tutorId,
                    studentId,
                    subjectId,
                    status,
                    startTimestamp,
                    duration,
                    tuition.url,
                    price,
                    currency,
                    iid,

                )
                await updateTuition(updatedTuition)



                setTuition(updatedTuition)

            }
            router.back()

        } catch (error) {
            console.error("Failed to submit the form", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="student">Student:</label>
                <select
                    id="student"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                >
                    <option value="" disabled selected>Choose Student</option>
                    {students.map(student => (
                        <option key={student.id} value={student.id!}>{student.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="tutor">Tutor:</label>
                <select
                    id="tutor"
                    value={tutorId}
                    onChange={(e) => setTutorId(e.target.value)}
                >
                    <option value="" disabled selected>Choose Tutor</option>
                    {tutors.map(tutor => (
                        <option key={tutor.id} value={tutor.id!}>{tutor.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor="subject">Subject:</label>
                <select
                    id="subject"
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                >
                    <option value="" disabled selected>Choose Subject</option>
                    {subjects.map(subject => (
                        <option key={subject.id} value={subject.id!}>{subject.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="status">Status:</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TuitionStatus)}
                >
                    {Object.values(TuitionStatus).map((statusValue) => (
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
                    onChange={(e) => setPrice(Number(e.target.value))}
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
                    onChange={(e) => setDuration(Number(e.target.value))}
                />
            </div>
            {tuition === null && <div>
                <label htmlFor="repeatWeeks">Repeat Weeks:</label>
                <input
                    type="number"
                    id="repeatWeeks"
                    value={repeatWeeks}
                    onChange={(e) => setRepeatWeeks(Number(e.target.value))}
                />
            </div>}


            <div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => router.back()}>Cancel</button>
            </div>
        </form>

    );
}