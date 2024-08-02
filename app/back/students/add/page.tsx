"use client";

import Link from 'next/link';
import StudentForm from '../studentForm';
import { useStudentPage } from '@/lib/context/page/studentPageContext';


export default function AddStudent() {
    const { student, setStudent } = useStudentPage();

    setStudent(null)



    return (
        <div>
            <Link href="/back/students">
                <button>Back to Student List</button>
            </Link>

            <h2>Add Student</h2>
            <StudentForm></StudentForm>
        </div>



    );
}