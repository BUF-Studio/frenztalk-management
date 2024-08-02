"use client";

import { useTutors } from '@/lib/context/collection/tutorContext';
import { useTutorPage } from '@/lib/context/page/tutorPageContext';
import { Tutor } from '@/lib/models/tutor';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function TutorList() {
    const { tutors } = useTutors();
    const { setTutor } = useTutorPage();

    const router = useRouter();

    const viewTutor = (tutor: Tutor) => {
        setTutor(tutor)
        router.push(`/back/tutors/${tutor.id}`)
    }

    return (
        <div>
            <h1>Tutor List</h1>
            <ul>
                {tutors.map((tutor) => (
                    <li key={tutor.id}>
                        <button onClick={(e) => { viewTutor(tutor) }}>
                            {tutor.name}
                        </button>

                    </li>
                ))}
            </ul>
        </div>
    );
}