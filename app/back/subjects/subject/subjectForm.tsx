

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
    const [level, setLevel] = useState(subject?.levelId || '');



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();



        try {

            if (subject === null) {
                const newSubject = new Subject(null, name, level);
                await addSubject(newSubject)

            } else {
                const updatedSubject = new Subject(subject.id, name, level);
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
                <label htmlFor="level-dropdown">Select Level: </label>
                <select
                    id="level-dropdown"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                >
                    <option value="" disabled>Select a level</option>
                    {levels.map((level) => (
                        <option key={level.id} value={level.id!}>
                            {level.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => router.back()}>Cancel</button>
            </div>
        </form>

    );
}