"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTutorPage } from '@/lib/context/page/tutorPageContext';
import Link from 'next/link';
import { useTutors } from '@/lib/context/collection/tutorContext';
import TutorForm from '../../tutorForm';

export default function EditTutor({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { tutor, setTutor } = useTutorPage();
  const [name, setName] = useState(tutor?.name || '');
  // const [age, setAge] = useState(tutor?.age || 0);
  const { tutors } = useTutors();

  if (tutor === null || tutor.id !== params.id) {

    const foundTutor = tutors.find(s => s.id === params.id);
    if (foundTutor)
      setTutor(foundTutor);
  }


  if (tutor === null) {
    return (
      <div>
        <h1>Tutor Not Found</h1>

        <button onClick={(e) => { router.back() }}>Back </button>

      </div>
    );
  }



  return (
    <div className="edit-page">
      <h2>Edit Tutor</h2>
      <TutorForm></TutorForm>
    </div>
  );
}