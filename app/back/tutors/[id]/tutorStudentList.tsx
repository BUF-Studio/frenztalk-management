"use client";

import { useStudents } from '@/lib/context/collection/studentsContext';
import { useTutors } from '@/lib/context/collection/tutorContext';
import { useStudentPage } from '@/lib/context/page/studentPageContext';
import { useTutorPage } from '@/lib/context/page/tutorPageContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function TutorStudentList() {
    const { students } = useStudents();
    const { tutorStudent } = useTutorPage();
    const router = useRouter();


    if (tutorStudent.length === 0) {
        return (
            <div>
                <h1>No Student Found</h1>

            </div>
        );
    }


    return (
        <div>
            <h1>Student Tutor List</h1>
            <ul>
                {tutorStudent.map((student) => (
                    <li key={student.id}>
                        <button onClick={(e) => {
                            router.push(`/back/students/${student.id}`)
                        }}>

                            {student.name}
                        </button>

                    </li>
                ))}
            </ul>
        </div>
    );
}