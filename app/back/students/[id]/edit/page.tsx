"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentPage } from '@/lib/context/page/studentPageContext';
import { useStudents } from '@/lib/context/collection/studentsContext';
import StudentForm from '../../studentForm';
import Link from 'next/link';

export default function EditStudent({ params }: { params: { id: string } }) {
  const { student, setStudent } = useStudentPage();

  const router = useRouter();
  const { students } = useStudents();
  if (student === null) {
    return (
      <div>
        <h1>Student Not Found</h1>
        
          <button onClick={(e)=>{router.back()}}>Back</button>
        
      </div>
    );
  }


  if (student === null || student.id !== params.id) {
    const foundStudent = students.find(s => s.id === params.id);
    if (foundStudent)
      setStudent(foundStudent);
  }


  return (
    <div className="edit-page">
      <h2>Edit Student</h2>
      <StudentForm></StudentForm>
    </div>
  );
}