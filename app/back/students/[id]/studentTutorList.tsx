"use client";

import { useStudents } from '@/lib/context/collection/studentsContext';
import { useTuitions } from '@/lib/context/collection/tuitionContext';
import { useTutors } from '@/lib/context/collection/tutorContext';
import { useStudentPage } from '@/lib/context/page/studentPageContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function StudentTutorList() {
    const { studentTutor } = useStudentPage();
    const router = useRouter();


    if (studentTutor.length === 0) {
        return (
            <div>
                <h1>No Tutor Found</h1>

            </div>
        );
    }


    return (
        <div>
            <h1>Student Tutor List</h1>
            <ul>
                {studentTutor.map((tutor) => (
                    <li key={tutor.id}>
                        <button onClick={(e) => {
                            router.push(`/back/tutors/${tutor.id}`)
                        }}>
                            {tutor.name}
                        </button>

                    </li>
                ))}
            </ul>
        </div>
    );
}