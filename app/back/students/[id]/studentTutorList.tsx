"use client";

import { useStudents } from '@/lib/context/collection/studentsContext';
import { useTuitions } from '@/lib/context/collection/tuitionContext';
import { useTutors } from '@/lib/context/collection/tutorContext';
import { useStudentPage } from '@/lib/context/page/studentPageContext';
import Link from 'next/link';



export default function StudentTutorList() {
    const { studentTutor } = useStudentPage();


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
                        {tutor.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}