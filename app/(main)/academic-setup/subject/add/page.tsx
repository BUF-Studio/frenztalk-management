"use client";

import Link from 'next/link';
import { useStudentPage } from '@/lib/context/page/studentPageContext';
import SubjectForm from '../subjectForm';
import { useRouter } from 'next/navigation';


export default function AddStudent() {
    const { student, setStudent } = useStudentPage();
    const router = useRouter();
    setStudent(null)

    return (
        <div>
         
                <button onClick={(e)=>{router.back()}}>Back</button>


            <h2>Add Subject</h2>
            <SubjectForm></SubjectForm>
        </div>



    );
}