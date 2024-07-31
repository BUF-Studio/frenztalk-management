"use client";

import { useSubjects } from '@/lib/context/collection/subjectContext';
import Link from 'next/link';



export default function SubjectList() {
    const { subjects } = useSubjects();



    return (
        <div>
            <h1> Subject List</h1>
            <ul>
                {subjects.map((subject) => (
                    <li key={subject.id}>
                        <Link href={`/back/subjects/${subject.id}`}>
                            {subject.id}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}