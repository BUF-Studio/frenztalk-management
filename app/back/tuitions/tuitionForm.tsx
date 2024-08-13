

"use client";
import { useEffect, useState } from 'react';
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
import { Student } from '@/lib/models/student';
import { Tutor } from '@/lib/models/tutor';
import { useLevels } from '@/lib/context/collection/levelContext';
import InvoiceType from '@/lib/models/invoiceType';
import axios from 'axios';

export default function TuitionForm() {
    const router = useRouter();
    const { levels } = useLevels();
    const { tuition, student, tutor, subject, setTuition } = useTuitionPage();

    const { students } = useStudents()
    const { tutors } = useTutors()
    const { subjects } = useSubjects()


    const [name, setName] = useState(tuition?.name || '');
    const [studentId, setStudentId] = useState(tuition?.studentId || student?.id || '');
    const [tutorId, setTutorId] = useState(tuition?.tutorId || tutor?.id || '');
    const [subjectId, setSubjectId] = useState(tuition?.subjectId || subject?.id || '');
    const [status, setStatus] = useState(tuition?.status || '');

    const [levelId, setLevelId] = useState(tuition?.levelId || '');



    const [currency, setCurrency] = useState<Currency>(tuition?.currency || Currency.MYR);
    const [studentPrice, setStudentPrice] = useState(tuition?.studentPrice || 0);
    const [tutorPrice, setTutorPrice] = useState(tuition?.tutorPrice || 0);
    const [startDateTime, setStartDateTime] = useState(tuition?.startTime?.slice(0, 16) || '');
    const [duration, setDuration] = useState(tuition?.duration || 60);
    const [repeatWeeks, setRepeatWeeks] = useState(1);





    useEffect(() => {
        if (levelId !== '') {
            const selectedLevel = levels.find(l => levelId === l.id);
            switch (currency) {
                case Currency.USD:
                    setStudentPrice(selectedLevel!.student_price_usd);
                    setTutorPrice(selectedLevel!.tutor_price_usd);
                    break;
                case Currency.GBP:
                    setStudentPrice(selectedLevel!.student_price_gbp);
                    setTutorPrice(selectedLevel!.tutor_price_gbp);
                    break;
                case Currency.MYR:
                default:
                    setStudentPrice(selectedLevel!.student_price_myr);
                    setTutorPrice(selectedLevel!.tutor_price_myr);
                    break;
            }
        }
    }, [levelId, currency]);


    const authToken = async () => {
        try {
            const response = await axios.post('/api/auth/authorize');
            const data = response.data['access_token']
            console.error(data);
            return data
        } catch (error) {
            console.error(error);
        }
    }

    const createZoom = async (topic: string, start_time: string, duration: number) => {
        try {
            const token = await authToken()
            const response = await axios.post('/api/addZoom', {
                accessToken: token,
                topic: topic,
                start_time: start_time,
                duration: duration,
                password: null,
            });
            const meetingid = response.data.id
            const url = response.data.join_url
            console.log(url);
            return { meetingid, url }
        } catch (error) {
            console.error(error);
            return null
        }
    }


    const updateZoom = async (meetingId: string, topic: string, start_time: string, duration: number) => {
        try {
            const token = await authToken()
            const response = await axios.post('/api/updateZoom', {
                accessToken: token,
                meetingId: meetingId,
                topic: topic,
                start_time: start_time,
                duration: duration,
                password: null,
                recurrence: null,
            });
            if (response.status === 204) {
                console.log('Meeting updated successfully.');
                return { success: true };
            } else {
                // Handle other status codes if needed
                console.error('Unexpected response status:', response.status);
                return { success: false, error: `Unexpected response status: ${response.status}` };
            }

        } catch (error: any) {
            if (error.response) {
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                return { success: false, error: error.response.data.message };
            } else {
                console.error('Error message:', error.message);
                return { success: false, error: 'An error occurred' };
            }
        }
    }




    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {

            const startTime = new Date(startDateTime);

            if (tuition === null) {

                for (let i = 0; i <= repeatWeeks - 1; i++) {
                    const newStartTime = new Date(startTime.getTime() + (i * 7 * 24 * 60 * 60 * 1000) + (8 * 60 * 60 * 1000));
                    const zoomStartTime = newStartTime.toISOString();
                    // const 

                    const zoom = await createZoom(name, zoomStartTime, duration)
                    if (zoom !== null) {
                        const { meetingid, url } = zoom
                        const newTuition = new Tuition(
                            null,
                            name,
                            tutorId,
                            studentId,
                            subjectId,
                            levelId,
                            status,
                            zoomStartTime,
                            duration,
                            url,
                            studentPrice,
                            tutorPrice,
                            currency,
                            null,
                            null,
                            meetingid,
                        );
                        const tid = await addTuition(newTuition);
                    } else {
                        console.log('Failed to create zoom meeting')
                    }


                }


            } else {
                const newStartTime = new Date(startTime.getTime() + (8 * 60 * 60 * 1000));

                const zoomStartTime = newStartTime.toISOString()

                if (tuition.startTime !== zoomStartTime || tuition.name !== name || tuition.duration !== duration) {
                    console.log(tuition.meetingId!)
                    await updateZoom(tuition.meetingId!, name, zoomStartTime, duration,)
                    // error handling
                }

                // let newInvoice: boolean = false
                let tiid = tuition.tutorInvoiceId;
                let siid = tuition.studentInvoiceId;
                if (tuition.status !== TuitionStatus.END && status === TuitionStatus.END && (tiid === null || siid === null)) {
                    if (siid === null) {
                        const studentRate = studentPrice * duration / 60
                        const studentInvoice = new Invoice(
                            null,
                            tuition.id!,
                            tutorId,
                            studentId,
                            subjectId,
                            studentRate,
                            InvoiceStatus.PENDING,
                            zoomStartTime,
                            duration,
                            currency,
                            studentPrice,
                            InvoiceType.STUDENT
                        )

                        siid = await addInvoice(studentInvoice)
                    }
                    if (tiid === null) {
                        const tutorRate = tutorPrice * duration / 60
                        const tutorInvoice = new Invoice(
                            null,
                            tuition.id!,
                            tutorId,
                            studentId,
                            subjectId,
                            tutorRate,
                            InvoiceStatus.PENDING,
                            zoomStartTime,
                            duration,
                            currency,
                            tutorPrice,
                            InvoiceType.TUTOR,
                        )

                        tiid = await addInvoice(tutorInvoice)
                    }
                }


                const updatedTuition = new Tuition(
                    tuition.id,
                    name,
                    tutorId,
                    studentId,
                    subjectId,
                    levelId,
                    status,
                    zoomStartTime,
                    duration,
                    tuition.url,
                    studentPrice,
                    tutorPrice,
                    currency,
                    siid,
                    tiid,
                    tuition.meetingId
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
                <label htmlFor="level-dropdown">Select Level: </label>
                <select
                    id="level-dropdown"
                    value={levelId}
                    onChange={(e) => setLevelId(e.target.value)}
                >
                    <option value="" disabled>Select a level</option>
                    {levels.map((level) => (
                        <option key={level.id} value={level.id!}>
                            {level.name}
                        </option>
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
                <label htmlFor="price">Student Price / hour:</label>
                <input
                    type="number"
                    id="studentPrice"
                    value={studentPrice}
                    onChange={(e) => setStudentPrice(Number(e.target.value))}
                />
            </div>
            <div>
                <label htmlFor="price">Tutor Price / hour:</label>
                <input
                    type="number"
                    id="tutorPrice"
                    value={tutorPrice}
                    onChange={(e) => setTutorPrice(Number(e.target.value))}
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