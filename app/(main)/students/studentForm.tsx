"use client";

import { useStudentPage } from '@/lib/context/page/studentPageContext';
import { addStudent, updateStudent } from '@/lib/firebase/student';
import { Student } from '@/lib/models/student';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';




const StudentForm= () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [email, setEmail] = useState('');
  const { student, setStudent } = useStudentPage();



  const router = useRouter();



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


    try {
      if (student) {
        const newStudent = new Student(student.studentId, name, age, 'Active', student.subjectsId, student.tutorsId)
        await updateStudent(newStudent)
      } else {
        const newStudent = new Student(null, name, age, 'Active', [], [])
        await addStudent(newStudent)
      }
      setStudent(null)
      router.back()
    } catch (error) {
      console.error('Failed');
      console.error(error);
    }
  };

  const back = () => {
    setStudent(null)
    router.push('/students')
  }

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
      </form>
      <button onClick={() => back()}>Back</button>
    </div>
  );
};

export default StudentForm;