"use client";

import { useSubjectPage } from '@/lib/context/page/subjectPageContext';
import Link from 'next/link';
import { useSubjects } from '@/lib/context/collection/subjectContext';



export default function SubjectDetail({ params }: { params: { id: string } }) {
    const { subject, setSubject } = useSubjectPage();
    const { subjects } = useSubjects();


    if (subject === null || subject.id !== params.id) {
        const foundSubject = subjects.find(s => s.id === params.id);
        if (foundSubject)
            setSubject(foundSubject);
    }

    if (subject === null) {
        return (
            <div>
                <h1>Subject Not Found</h1>
                <Link href="/back/subjects">
                    <button>Back to Subject List</button>
                </Link>
            </div>
        );
    }


    return (
        <div>
            <Link href="/back/subjects">
                <button>Back to Subject List</button>
            </Link>

            <div>
                <h1>Subject Details</h1>
                <p>Name: {subject.name}</p>
                <Link href={`/back/subjects/${subject.id}/edit`}>
                    <button>Edit</button>
                </Link>

            </div>




        </div>

    );
}