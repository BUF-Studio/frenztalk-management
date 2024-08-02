"use client";

import { useTuitions } from '@/lib/context/collection/tuitionContext';
import { useTuitionPage } from '@/lib/context/page/tuitionPageContext';
import { Tuition } from '@/lib/models/tuition';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function TuitionList() {
    const { tuitions } = useTuitions();
    const router = useRouter();
    const { setTuition } = useTuitionPage();

    const addTuition = () => {
        setTuition(null)
        router.push('/back/tuitions/add')
    }
    const viewTuition = (tuition: Tuition) => {
        setTuition(tuition)
        router.push(`/back/tuitions/${tuition.id}`)
    }

    return (
        <div>
            <h1>Tuition List</h1>
            <ul>
                {tuitions.map((tuition) => (
                    <li key={tuition.id}>
                        <button onClick={(e) => { viewTuition(tuition) }}>

                            {tuition.name}
                        </button>

                    </li>
                ))}
            </ul>

            <button onClick={addTuition}>Add Tuition</button>
        </div>
    );
}