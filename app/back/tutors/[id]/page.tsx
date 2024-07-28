"use client";

import { useTutorPage } from '@/lib/context/page/tutorPageContext';
import Link from 'next/link';
import TutorInvoiceList from './tutorInvoiceList';
import TutorTuitionList from './tutorTuitionList';
import { useTutors } from '@/lib/context/collection/tutorContext';
import TutorStudentList from './tutorStudentList';



export default function TutorDetail({ params }: { params: { id: string } }) {
    const { tutor, setTutor } = useTutorPage();
    const { tutors } = useTutors();


    if (tutor === null) {
        const foundTutor = tutors.find(s => s.id === params.id);
        if (foundTutor)
            setTutor(foundTutor);
    }

    if (tutor === null) {
        return (
            <div>
                <h1>Tutor Not Found</h1>
                <Link href="/back/tutors">
                    <button>Back to Tutor List</button>
                </Link>
            </div>
        );
    }


    return (
        <div>
            <Link href="/back/tutors">
                <button>Back to Tutor List</button>
            </Link>

            <div>
                <h1>Tutor Details</h1>
                <p>Name: {tutor.name}</p>
                <Link href={`/back/tutors/${tutor.id}/edit`}>
                    <button>Edit</button>
                </Link>

            </div>
            <TutorTuitionList></TutorTuitionList>
            <TutorStudentList></TutorStudentList>
            <TutorInvoiceList></TutorInvoiceList>



        </div>

    );
}