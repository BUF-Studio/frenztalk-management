"use client";

import { useStudents } from '@/lib/context/collection/studentsContext';
import { useTutors } from '@/lib/context/collection/tutorContext';
import { useStudentPage } from '@/lib/context/page/studentPageContext';
import Link from 'next/link';



export default function StudentTutorList() {
    const { tutors } = useTutors();
    const { student, setStudent } = useStudentPage();

    const matchingTutors = tutors.filter(tutor =>
        student?.tutorsId.includes(tutor!.id!)
    );

    if (matchingTutors.length === 0) {
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
                {matchingTutors.map((tutor) => (
                    <li key={tutor.id}>
                        {tutor.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}