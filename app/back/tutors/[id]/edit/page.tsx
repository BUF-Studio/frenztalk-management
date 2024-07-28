"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentPage } from '@/lib/context/page/studentPageContext';

export default function EditStudent() {
  const router = useRouter();
  const { student, setStudent } = useStudentPage();
  const [name, setName] = useState(student?.name || '');
  const [age, setAge] = useState(student?.age || 0);

  if (!student) return <div>Loading...</div>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically call an API to update the student
    console.log('Updating student:', { ...student, name, age });
    // Update the student in the context
    // setStudent({ ...student, name, age });
    router.back();
  };

  return (
    <div className="edit-page">
      <h2>Edit Student</h2>
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
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
          />
        </div>
        <div>
          <button type="submit">Save</button>
          <button type="button" onClick={() => router.back()}>Cancel</button>
        </div>
      </form>
    </div>
  );
}