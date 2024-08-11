"use client";

import { useTuitions } from '@/lib/context/collection/tuitionContext';
import { useTuitionPage } from '@/lib/context/page/tuitionPageContext';
import type { Tuition } from '@/lib/models/tuition';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MonthCalendar from "@/app/components/dashboard/Calendar";

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


    


    // const zoom = async () => {
    //     try {
    //         const response = await axios.post<MeetingData>('/api/addZoom', {
    //             topic: "Hello",
    //             start_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    //             duration: 60,
    //             password: null,
    //         });

    //         console.log(response.data);
    //         console.log(response.data.join_url);
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }

    // const zoomAuth = () => {
    //     window.location.href = '/api/auth/authorize';
    //   };



    return (
        <div>
            <MonthCalendar events={tuitions} />
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
            {/* <button onClick={zoom}>Test Zoom</button> */}
            {/* <button onClick={zoomAuth}>Zoom Auth</button> */}
        </div>
    );
}