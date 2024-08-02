"use client";

import Link from 'next/link';
import { useStudentPage } from '@/lib/context/page/studentPageContext';
import LevelForm from '../levelForm';


export default function AddStudent() {
    const { student, setStudent } = useStudentPage();

    setStudent(null)

    return (
        <div>
            <Link href="/back/subjects">
                <button>Back to Subject List</button>
            </Link>

            <h2>Add Level</h2>
            <LevelForm></LevelForm>
        </div>



    );
}