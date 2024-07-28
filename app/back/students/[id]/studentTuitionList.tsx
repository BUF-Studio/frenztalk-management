"use client";

import { useStudents } from '@/lib/context/collection/studentsContext';
import { useTuitions } from '@/lib/context/collection/tuitionContext';
import { useStudentPage } from '@/lib/context/page/studentPageContext';
import Link from 'next/link';



export default function StudentTuitionList() {
    const { tuitions } = useTuitions();
    const { student, setStudent } = useStudentPage();

    if (student === null) {
        return (
            <div>
                <h1>No Tuition Found</h1>

            </div>
        );
    }

    const matchingTuitions = tuitions.filter(tuition =>
        student.tuitionsId.includes(tuition!.id!)
    );

    if (matchingTuitions.length === 0) {
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
                {matchingTuitions.map((tuition) => (
                    <li key={tuition.id}>
                        {tuition.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}