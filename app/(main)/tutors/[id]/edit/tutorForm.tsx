

"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTutorPage } from '@/lib/context/page/tutorPageContext';
import { Tutor } from '@/lib/models/tutor';
import { updateTutor } from '@/lib/firebase/tutor';

export default function TutorForm() {
    const router = useRouter();
    const { tutor, setTutor } = useTutorPage();
    const [name, setName] = useState(tutor?.name || '');
    const [des, setDes] = useState(tutor?.des || '');
    const [status, setStatus] = useState(tutor?.status || "active");



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedTutor = new Tutor(tutor!.id, name, des, status, '');
            await updateTutor(updatedTutor)

            setTutor(updatedTutor)

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
                <label htmlFor="des">Description:</label>
                <input
                    type="text"
                    id="des"
                    value={des}
                    onChange={(e) => setDes(e.target.value)}
                />
            </div>
            {/* <div>
                <label htmlFor="age">Age:</label>
                <input
                    type="number"
                    id="age"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                />
            </div> */}
            <div>
                <label htmlFor="status">Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="active">Active</option>
                    <option value="frozen">Frozen</option>
                </select>
            </div>
            <div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => router.back()}>Cancel</button>
            </div>
        </form>

    );
}