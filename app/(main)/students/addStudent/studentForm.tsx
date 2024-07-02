"use client";

import { addStudent } from '@/lib/firebase/student';
import { Student } from '@/lib/models/student';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface StudentFormProps {
  student?: Student; // Optional prop for existing student data
}


const StudentForm: React.FC<StudentFormProps> = ({ student }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [email, setEmail] = useState('');

  
  const router = useRouter();

  const cancel = () => {
    // router.back()
  }

  useEffect(() => {
    if (student) {
      setName(student.name);
      setAge(student.age);
    }
  }, [student]);


  const handleSubmit = async (e: React.FormEvent) => {
  // const router = useRouter();
    e.preventDefault();
    console.log({ name, age, email });

    if (age === '' || isNaN(age)) {
      alert('Please enter a valid age.');
      return;
    }


    const student = new Student(null, name, age)
    try {
      await addStudent(student)
      router.back()
    } catch (error) {
      console.error('Failed to add student');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow-lg">
      <h2 className="text-2xl mb-4">Add Student</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value ? parseInt(e.target.value) : '')}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        {/* <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div> */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded mt-4"
        >
          Add Student
        </button>
        <Link href={'/students'}>Back</Link>
      </form>
    </div>
  );
};

export default StudentForm;