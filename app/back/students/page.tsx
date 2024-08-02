"use client";

import { useStudents } from '@/lib/context/collection/studentsContext';
import { useStudentPage } from '@/lib/context/page/studentPageContext';
import { Student } from '@/lib/models/student';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function StudentList() {
    const { students } = useStudents();
    const router = useRouter();
    const { setStudent } = useStudentPage();

    const addStudent = () => {
        setStudent(null)
        router.push('/back/students/add')
    }
    const viewStudent = (student: Student) => {
        setStudent(student)
        router.push(`/back/students/${student.id}`)
    }

    return (
        <div>
            <h1>Student List</h1>
            <ul>
                {students.map((student) => (
                    <li key={student.id}>
                        <button onClick={(e) => { viewStudent(student) }}>

                            {student.name}
                        </button>

                    </li>
                ))}
            </ul>

            <button onClick={addStudent}>Add Student</button>
        </div>
    );
}