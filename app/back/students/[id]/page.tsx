"use client";

import { useStudents } from '@/lib/context/collection/studentsContext';
import { useStudentPage } from '@/lib/context/page/studentPageContext';
import Link from 'next/link';
import StudentTutorList from './studentTutorList';
import StudentTuitionList from './studentTuitionList';
import StudentInvoiceList from './studentInvoiceList';



export default function StudentDetail({ params }: { params: { id: string } }) {
    const { student, setStudent } = useStudentPage();
    const { students } = useStudents();


    if (student === null) {
        const foundStudent = students.find(s => s.id === params.id);
        if (foundStudent)
            setStudent(foundStudent);
    }

    if (student === null) {
        return (
            <div>
                <h1>Student Not Found</h1>
                <Link href="/back/students">
                    <button>Back to Student List</button>
                </Link>
            </div>
        );
    }


    return (
        <div>
            <Link href="/back/students">
                <button>Back to Student List</button>
            </Link>

            <div>
                <h1>Student Details</h1>
                <p>Name: {student.name}</p>
                <p>Age: {student.age}</p>
                <Link href={`/back/students/${student.id}/edit`}>
                    <button>Edit</button>
                </Link>

            </div>
            <StudentTuitionList></StudentTuitionList>
            <StudentTutorList></StudentTutorList>
            <StudentInvoiceList></StudentInvoiceList>



        </div>

    );
}