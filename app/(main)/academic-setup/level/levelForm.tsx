

"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Level } from '@/lib/models/level';
import { addLevel, updateLevel } from '@/lib/firebase/avaSubject';
import { useLevelPage } from '@/lib/context/page/levelPageContext';

export default function LevelForm() {
    const router = useRouter();
    const { level, setLevel } = useLevelPage();
    const [name, setName] = useState(level?.name || '');
    const [student_price_myr, setStudentPrice_myr] = useState(level?.student_price_myr);
    const [student_price_usd, setStudentPrice_usd] = useState(level?.student_price_usd);
    const [student_price_gbp, setStudentPrice_gbp] = useState(level?.student_price_gbp);
    const [tutor_price_myr, setTutorPrice_myr] = useState(level?.tutor_price_myr);
    const [tutor_price_usd, setTutorPrice_usd] = useState(level?.tutor_price_usd);
    const [tutor_price_gbp, setTutorPrice_gbp] = useState(level?.tutor_price_gbp);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (Number.isNaN(student_price_myr) || student_price_myr === undefined) {
            alert("Please enter a valid student price ( RM ).");
            return;
        }
        if (Number.isNaN(student_price_usd) || student_price_usd === undefined) {
            alert("Please enter a valid student price ( USD ).");
            return;
        }
        if (Number.isNaN(student_price_gbp) || student_price_gbp === undefined) {
            alert("Please enter a valid student price ( GBP ).");
            return;
        }
        if (Number.isNaN(tutor_price_myr) || tutor_price_myr === undefined) {
            alert("Please enter a valid tutor price ( RM ).");
            return;
        }
        if (Number.isNaN(tutor_price_usd) || tutor_price_usd === undefined) {
            alert("Please enter a valid tutor price ( USD ).");
            return;
        }
        if (Number.isNaN(tutor_price_gbp) || tutor_price_gbp === undefined) {
            alert("Please enter a valid tutor price ( GBP ).");
            return;
        }


        try {

            if (level === null) {
                const newLevel = new Level(null, name, student_price_myr, student_price_usd, student_price_gbp,tutor_price_myr, tutor_price_usd, tutor_price_gbp);
                await addLevel(newLevel)

            } else {
                const updatedLevel = new Level(level.id, name, student_price_myr, student_price_usd, student_price_gbp,tutor_price_myr, tutor_price_usd, tutor_price_gbp);
                await updateLevel(updatedLevel)
                setLevel(updatedLevel)

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

            <h1>Student Price</h1>

            <div>
                
                <label htmlFor="myr">Student Price ( RM ):</label>
                <input
                    type="number"
                    value={student_price_myr}
                    onChange={(e) => setStudentPrice_myr(Number(e.target.value))}
                />
            </div>
            <div>
                <label htmlFor="usd">Student Price ( USD ):</label>
                <input
                    type="number"
                    value={student_price_usd}
                    onChange={(e) => setStudentPrice_usd(Number(e.target.value))}
                />
            </div>
            <div>
                <label htmlFor="gbp">Student Price ( GBP ):</label>
                <input
                    type="number"
                    value={student_price_gbp}
                    onChange={(e) => setStudentPrice_gbp(Number(e.target.value))}
                />
            </div>
            <h1>Tutor Price</h1>

            <div>
                
                <label htmlFor="myr">Tutor Price ( RM ):</label>
                <input
                    type="number"
                    value={tutor_price_myr}
                    onChange={(e) => setTutorPrice_myr(Number(e.target.value))}
                />
            </div>
            <div>
                <label htmlFor="usd">Tutor Price ( USD ):</label>
                <input
                    type="number"
                    value={tutor_price_usd}
                    onChange={(e) => setTutorPrice_usd(Number(e.target.value))}
                />
            </div>
            <div>
                <label htmlFor="gbp">Tutor Price ( GBP ):</label>
                <input
                    type="number"
                    value={tutor_price_gbp}
                    onChange={(e) => setTutorPrice_gbp(Number(e.target.value))}
                />
            </div>

            <div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => router.back()}>Cancel</button>
            </div>
        </form>

    );
}