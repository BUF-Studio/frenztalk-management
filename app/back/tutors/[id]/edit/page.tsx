"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTutorPage } from '@/lib/context/page/tutorPageContext';
import Link from 'next/link';
import { useTutors } from '@/lib/context/collection/tutorContext';

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
        <Link href="/back/tutors">
          <button>Back to Tutor List</button>
        </Link>
      </div>
    );
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    router.back();
  };

  return (
    <div className="edit-page">
      <h2>Edit Tutor</h2>
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
          <button type="submit">Save</button>
          <button type="button" onClick={() => router.back()}>Cancel</button>
        </div>
      </form>
    </div>
  );
}