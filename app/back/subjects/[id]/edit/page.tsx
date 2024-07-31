"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSubjectPage } from '@/lib/context/page/subjectPageContext';
import { useSubjects } from '@/lib/context/collection/subjectContext';

export default function EditSubject({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { subject, setSubject } = useSubjectPage();
  const [name, setName] = useState(subject?.name || '');
  // const [age, setAge] = useState(subject?.age || 0);

  const { subjects } = useSubjects();

  if (subject === null || subject.id !== params.id) {
    const foundSubject = subjects.find(s => s.id === params.id);
    if (foundSubject)
      setSubject(foundSubject);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  
    router.back();
  };

  return (
    <div className="edit-page">
      <h2>Edit Subject</h2>
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