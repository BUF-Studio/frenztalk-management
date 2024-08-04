"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLevelPage } from '@/lib/context/page/levelPageContext';
import Link from 'next/link';
import { useLevels } from '@/lib/context/collection/levelContext';
import LevelForm from '../levelForm';

export default function EditLevel({ params }: { params: { id: string } }) {
  const { level, setLevel } = useLevelPage();
  
  const router = useRouter();
  const { levels } = useLevels();
  if (level === null) {
    return (
      <div>
        <h1>Level Not Found</h1>
      
          <button onClick={(e)=>{router.back()}}>Back</button>
       
      </div>
    );
  }


  if (level === null || level.id !== params.id) {
    const foundLevel = levels.find(s => s.id === params.id);
    if (foundLevel)
      setLevel(foundLevel);
  }


  return (
    <div className="edit-page">
      <h2>Edit Level</h2>
      <LevelForm></LevelForm>
    </div>
  );
}