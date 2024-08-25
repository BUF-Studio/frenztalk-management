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
import { useEffect, useState } from "react";

export default function StudentTuitionList({ filter }: { filter?: Date | null}) {
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
    router.push(`/tuitions/${tuitionId}`);
  };

  return (
    <div>
      <div className="flex flex-col gap-2 justify-between items-center">
        {studentTuition.length === 0 && (
          <div className="bg-white w-full border-1 border-grey-600 rounded-lg overflow-hidden p-4">
            <h1 className="flex justify-center font-normal text-gray-500">
              No Tuition Found
            </h1>
          </div>
        )}
        
        {
        studentTuition
        .filter((tuition) => {
            if (!filter) return true; // If filter is null, return all tuition objects
            const tuitionDate = new Date(tuition.startTime ?? "").toDateString();
            const filterDate = new Date(filter).toDateString();
            return tuitionDate === filterDate; // Compare the dates only
          })
          .map((tuition) => (
            <TuitionCard
              key={tuition.id}
              subject={findSubject(tuition.subjectId)}
              level={findLevel(tuition.levelId)}
              time={tuition.startTime ?? ""}
              duration={tuition.duration}
              status="Active"
              tutor={findTutor(tuition.tutorId)}
              price="Unset"
              meetingLink={tuition.url}
              onClick={() => handleCardClick(tuition.id ?? "")}
            />
          ))}
      </div>
    </div>
  );
}
