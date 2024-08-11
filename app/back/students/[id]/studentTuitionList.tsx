"use client";

import TuitionCard from "@/app/components/ui/tuitionCard";
import { useLevels } from "@/lib/context/collection/levelContext";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useStudentPage } from "@/lib/context/page/studentPageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StudentTuitionList() {
  const { tuitions } = useTuitions();
  const { studentTuition } = useStudentPage();
  const { tutors } = useTutors();
  const router = useRouter();
  const { subjects } = useSubjects();
  const { levels } = useLevels();

  const findSubject = (id: string) => {
    const subject = subjects.find((subject) => subject.id === id);
    return subject?.name ?? "";
  };

  const findTutor = (id: string) => {
    const tutor = tutors.find((tutor) => tutor.id === id);
    return tutor?.name ?? "";
  };

  const findLevel = (id: string) => {
    const level = levels.find((level) => level.id === id);
    return level;
  };

  const handleCardClick = (tuitionId: string) => {
    router.push(`/back/tuitions/${tuitionId}`);
  };

  return (
    <div>
      <h1 className="text-lg font-normal mb-2">Classes</h1>
      <div className="flex flex-col gap-2 justify-between items-center">
        {studentTuition.length === 0 && (
          <div className="bg-white w-full border-1 border-grey-600 rounded-lg overflow-hidden p-4">
            <h1 className="flex justify-center font-normal text-gray-500">
              No Tuition Found
            </h1>
          </div>
        )}
        {studentTuition.map((tuition) => (
          <TuitionCard
            key={tuition.id}
            subject={findSubject(tuition.subjectId)}
            level={findLevel(tuition.levelId)}
            time="12PM to 2PM"
            status="Active"
            tutor={findTutor(tuition.tutorId)}
            price="Unset"
            meetingLink="meet.google.com/pwg-tgvo-kkc"
            onClick={() => handleCardClick(tuition.id ?? "")}
          />
        ))}
      </div>
    </div>
  );
}
