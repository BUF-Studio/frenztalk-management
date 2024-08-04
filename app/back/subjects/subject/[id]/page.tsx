"use client";

import { useSubjects } from "@/lib/context/collection/subjectContext";
import { useSubjectPage } from "@/lib/context/page/subjectPageContext";
import Link from "next/link";
import SubjectForm from '../subjectForm';
import { useRouter } from "next/navigation";

export default function EditSubject({ params }: { params: { id: string } }) {
  const { subject, setSubject } = useSubjectPage();
  const router = useRouter();

  const { subjects } = useSubjects();
  if (subject === null) {
    return (
      <div>
        <h1>Subject Not Found</h1>

          <button onClick={(e)=>{router.back()}}>Back</button>

      </div>
    );
  }


  if (subject === null || subject.id !== params.id) {
    const foundSubject = subjects.find(s => s.id === params.id);
    if (foundSubject)
      setSubject(foundSubject);
  }


  return (
    <div className="edit-page">
      <h2>Edit Subject</h2>

      <SubjectForm></SubjectForm>
    </div>
  );
}