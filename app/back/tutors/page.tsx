"use client";

import { useTutors } from '@/lib/context/collection/tutorContext';
import Link from 'next/link';



export default function TutorList() {
    const { tutors } = useTutors();

    return (
        <div>
            <h1>Tutor List</h1>
            <ul>
                {tutors.map((tutor) => (
                    <li key={tutor.id}>
                        <Link href={`/back/tutors/${tutor.id}`}>
                            {tutor.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}