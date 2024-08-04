"use client";

import { useTuitions } from '@/lib/context/collection/tuitionContext';
import { useTutorPage } from '@/lib/context/page/tutorPageContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function TutorTuitionList() {
    const { tuitions } = useTuitions();
    const { tutorTuition } = useTutorPage();

    const router = useRouter();
  
    if (tutorTuition.length === 0) {
        return (
            <div>
                <h1>No Tuition Found</h1>

            </div>
        );
    }


    return (
        <div>
            <h1>Tutor Tuition List</h1>
            <ul>
                {tutorTuition.map((tuition) => (
                    <li key={tuition.id}>
                         <button onClick={(e) => {
                            router.push(`/back/tuitions/${tuition.id}`)
                        }}>
                        {tuition.name}
                        </button>

                    </li>
                ))}
            </ul>
        </div>
    );
}