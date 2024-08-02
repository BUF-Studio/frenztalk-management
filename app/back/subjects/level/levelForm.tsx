

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
    const [price_myr, setPrice_myr] = useState(level?.price_myr);
    const [price_usd, setPrice_usd] = useState(level?.price_usd);
    const [price_gbp, setPrice_gbp] = useState(level?.price_gbp);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (Number.isNaN(price_myr) || price_myr === undefined) {
            alert("Please enter a valid price ( RM ).");
            return;
        }
        if (Number.isNaN(price_usd) || price_usd === undefined) {
            alert("Please enter a valid price ( USD ).");
            return;
        }
        if (Number.isNaN(price_gbp) || price_gbp === undefined) {
            alert("Please enter a valid price ( GBP ).");
            return;
        }


        try {

            if (level === null) {
                const newLevel = new Level(null, name, price_myr, price_usd, price_gbp);
                await addLevel(newLevel)

            } else {
                const updatedLevel = new Level(level.id, name, price_myr, price_usd, price_gbp);
                await updateLevel(updatedLevel)

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
                <label htmlFor="myr">Price ( RM ):</label>
                <input
                    type="number"
                    id="myr"
                    value={price_myr}
                    onChange={(e) => setPrice_myr(Number(e.target.value))}
                />
            </div>
            <div>
                <label htmlFor="usd">Price ( USD ):</label>
                <input
                    type="number"
                    id="usd"
                    value={price_usd}
                    onChange={(e) => setPrice_usd(Number(e.target.value))}
                />
            </div>
            <div>
                <label htmlFor="gbp">Price ( GBP ):</label>
                <input
                    type="number"
                    id="gbp"
                    value={price_gbp}
                    onChange={(e) => setPrice_gbp(Number(e.target.value))}
                />
            </div>

            <div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => router.back()}>Cancel</button>
            </div>
        </form>

    );
}