"use client";

import { useTutorPage } from '@/lib/context/page/tutorPageContext';
import Link from 'next/link';
import TutorInvoiceList from './tutorInvoiceList';
import TutorTuitionList from './tutorTuitionList';
import { useTutors } from '@/lib/context/collection/tutorContext';
import TutorStudentList from './tutorStudentList';
import { useTuitionPage } from '@/lib/context/page/tuitionPageContext';
import { useRouter } from 'next/navigation';



export default function TutorDetail({ params }: { params: { id: string } }) {
    const { tutor, setTutor } = useTutorPage();
    const { tutors } = useTutors();
    const { setTuitionTutor } = useTuitionPage();
    const router = useRouter();

    if (tutor === null || tutor.id !== params.id) {
        const foundTutor = tutors.find(s => s.id === params.id);
        if (foundTutor)
            setTutor(foundTutor);
    }

    if (tutor === null) {
        return (
            <div>
                <h1>Tutor Not Found</h1>
            
                    <button onClick={(e)=>{router.back()}}>Back</button>
          
            </div>
        );
    }

    const addTuition = () => {
        setTuitionTutor(tutor)
        router.push(`/back/tuitions/add`)
    }


    return (
        <div>

                <button onClick={(e)=>{router.back()}}>Back</button>


            <div>
                <h1>Tutor Details</h1>
                <p>Name: {tutor.name}</p>
                <Link href={`/back/tutors/${tutor.id}/edit`}>
                    <button>Edit</button>
                </Link>

            </div>

            <button onClick={addTuition}>Add Class</button>

            <TutorTuitionList></TutorTuitionList>
            <TutorStudentList></TutorStudentList>
            <TutorInvoiceList></TutorInvoiceList>



        </div>

    );
}