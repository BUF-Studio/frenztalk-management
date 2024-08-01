"use client";

import Link from 'next/link';
import TuitionForm from '../tuitionForm';
import { useTuitionPage } from '@/lib/context/page/tuitionPageContext';


export default function AddTuition() {
    const { tuition, setTuition } = useTuitionPage();

    setTuition(null)



    return (
        <div>
            <Link href="/back/tuitions">
                <button>Back to Tuition List</button>
            </Link>

            <h2>Add Tuition</h2>
            <TuitionForm></TuitionForm>
        </div>



    );
}