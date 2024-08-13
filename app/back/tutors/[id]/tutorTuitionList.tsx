"use client";

import TuitionCard from "@/app/components/ui/tuitionCard";
import { useLevels } from "@/lib/context/collection/levelContext";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import { useTutorPage } from "@/lib/context/page/tutorPageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TutorTuitionList() {
  const { tuitions } = useTuitions();
  const { tutorTuition } = useTutorPage();
  const { subjects } = useSubjects();
  const { students } = useStudents();
  const { levels } = useLevels();

  const router = useRouter();

  const findSubject = (id: string) => {
    const subject = subjects.find((subject) => subject.id === id);
    return subject?.name ?? "";
  };

  const findStudent = (id: string) => {
    const student = students.find((student) => student.id === id);
    return student;
  };

  const findLevel = (id: string) => {
    const level = levels.find((level) => level.id === id);
    return level;
  }

  const handleCardClick = (tuitionId: string) => {
    router.push(`/back/tuitions/${tuitionId}`);
  };

  return (
    <div>
      <h1 className="text-lg font-normal mb-2">Classes</h1>
      <div className="flex flex-col gap-2 justify-between items-center">
      {tutorTuition.length === 0 && (
          <div className="bg-white w-full border-1 border-grey-600 rounded-lg overflow-hidden p-4">
            <h1 className="flex justify-center font-normal text-gray-500">No Tuition Found</h1>
          </div>
        )}
        {tutorTuition.map((tuition) => (
          <TuitionCard
            key={tuition.id}
            duration={tuition.duration}
            subject={findSubject(tuition.subjectId)}
            level={findLevel(tuition.levelId)}
            time="12PM to 2PM"
            status="Active"
            student={findStudent(tuition.studentId)}
            price="Unset"
            meetingLink="meet.google.com/pwg-tgvo-kkc"
            onClick={() => handleCardClick(tuition.id ?? "")}
          />
        ))}
      </div>
    </div>
  );
}
