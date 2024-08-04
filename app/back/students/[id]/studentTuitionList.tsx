"use client";

import { useStudents } from '@/lib/context/collection/studentsContext';
import { useTuitions } from '@/lib/context/collection/tuitionContext';
import { useStudentPage } from '@/lib/context/page/studentPageContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function StudentTuitionList() {
    const { tuitions } = useTuitions();
    const { studentTuition } = useStudentPage();
    const router = useRouter();


    if (studentTuition === null) {
        return (
            <div>
                <h1>No Tuition Found</h1>

            </div>
        );
    }



    if (studentTuition.length === 0) {
        return (
            <div>
                <h1>No Tuition Found</h1>

            </div>
        );
    }


    return (
        <div>
            <h1>Student Tuition List</h1>
            <ul>
                {studentTuition.map((tuition) => (
                    <li key={tuition.id}>
                        <button onClick={(e) => {
                            router.push(`/back/tuitions/${tuition.id}`)
                        }}>
                            {tuition.name}
                        </button>

                    </li>
                ))}
            </ul>
        </div>
    );
}