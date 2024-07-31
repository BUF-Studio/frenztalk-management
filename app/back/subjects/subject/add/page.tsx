"use client";

import Link from 'next/link';
import { useStudentPage } from '@/lib/context/page/studentPageContext';
import SubjectForm from '../subjectForm';


export default function AddStudent() {
    const { student, setStudent } = useStudentPage();

    setStudent(null)

    return (
        <div>
            <Link href="/back/subjects">
                <button>Back to Subject List</button>
            </Link>

            <h2>Add Subject</h2>
            <SubjectForm></SubjectForm>
        </div>



    );
}