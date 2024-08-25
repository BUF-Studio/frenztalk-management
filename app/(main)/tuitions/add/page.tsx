"use client";

import Link from 'next/link';
import TuitionForm from '../tuitionForm';
import { useTuitionPage } from '@/lib/context/page/tuitionPageContext';
import { useRouter } from 'next/navigation';


export default function AddTuition() {
    const { tuition, setTuition } = useTuitionPage();
    const router = useRouter();
    setTuition(null)



    return (
        <div>
         
                <button onClick={(e)=>{router.back()}}>Back</button>
      

            <h2>Add Tuition</h2>
            <TuitionForm></TuitionForm>
        </div>



    );
}