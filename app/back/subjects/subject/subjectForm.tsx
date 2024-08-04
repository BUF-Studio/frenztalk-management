

"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSubjectPage } from '@/lib/context/page/subjectPageContext';
import { addSubject, updateSubject } from '@/lib/firebase/subject';
import { Subject } from '@/lib/models/subject';
import { useLevels } from '@/lib/context/collection/levelContext';

export default function SubjectForm() {
    const router = useRouter();
    const { subject, setSubject } = useSubjectPage();
    const { levels } = useLevels();
    const [name, setName] = useState(subject?.name || '');



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();



        try {

            if (subject === null) {
                const newSubject = new Subject(null, name);
                await addSubject(newSubject)

            } else {
                const updatedSubject = new Subject(subject.id, name);
                await updateSubject(updatedSubject)

            }
            router.back()

        } catch (error) {
            console.error("Failed to submit the form", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            
            <div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => router.back()}>Cancel</button>
            </div>
        </form>

    );
}