"use client";

import { useTuitions } from '@/lib/context/collection/tuitionContext';
import { useTuitionPage } from '@/lib/context/page/tuitionPageContext';
import Link from 'next/link';



export default function TuitionDetail({ params }: { params: { id: string } }) {
    const { tuition, setTuition } = useTuitionPage();
    const { tuitions } = useTuitions();


    if (tuition === null || tuition.id !==params.id) {
        const foundTuition = tuitions.find(s => s.id === params.id);
        if (foundTuition)
            setTuition(foundTuition);
    }

    if (tuition === null) {
        return (
            <div>
                <h1>Tuition Not Found</h1>
                <Link href="/back/tuitions">
                    <button>Back to Tuition List</button>
                </Link>
            </div>
        );
    }


    return (
        <div>
            <Link href="/back/tuitions">
                <button>Back to Tuition List</button>
            </Link>

            <div>
                <h1>Tuition Details</h1>
                <p>Name: {tuition.name}</p>
                <Link href={`/back/tuitions/${tuition.id}/edit`}>
                    <button>Edit</button>
                </Link>

            </div>
           

        </div>

    );
}