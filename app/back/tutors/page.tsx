"use client";

import { useStudents } from '@/lib/context/collection/studentsContext';
import Link from 'next/link';



export default function StudentList() {
    const { students } = useStudents();

    return (
        <div>
            <h1>Student List</h1>
            <ul>
                {students.map((student) => (
                    <li key={student.id}>
                        <Link href={`/back/students/${student.id}`}>
                            {student.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}