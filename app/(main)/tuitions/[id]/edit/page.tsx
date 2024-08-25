"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTuitionPage } from '@/lib/context/page/tuitionPageContext';
import TuitionForm from '../../tuitionForm';
import Link from 'next/link';
import { useTuitions } from '@/lib/context/collection/tuitionContext';

export default function EditTuition({ params }: { params: { id: string } }) {
  const { tuition, setTuition } = useTuitionPage();
  const router = useRouter();

  const { tuitions } = useTuitions();
  if (tuition === null) {
    return (
      <div>
        <h1>Tuition Not Found</h1>

        <button onClick={(e) => { router.back() }}>Back</button>

      </div>
    );
  }


  if (tuition === null || tuition.id !== params.id) {
    const foundTuition = tuitions.find(s => s.id === params.id);
    if (foundTuition)
      setTuition(foundTuition);
  }


  return (
    <div className="edit-page">
      <h2>Edit Tuition</h2>
      <TuitionForm></TuitionForm>
    </div>
  );
}