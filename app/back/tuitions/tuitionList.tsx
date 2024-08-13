"use client";

import TuitionCard from "@/app/components/ui/tuitionCard";
import { useLevels } from "@/lib/context/collection/levelContext";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useStudentPage } from "@/lib/context/page/studentPageContext";
import type { Tuition } from "@/lib/models/tuition";
import { useRouter } from "next/navigation";

type TuitionListProps = {
  tuitions: Tuition[];
};

const TuitionList: React.FC<TuitionListProps> = ({ tuitions }) => {
  const { tutors } = useTutors();
  const { students } = useStudents();
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

  const findStudent = (id: string) => {
    const student = students.find((student) => student.id === id);
    return student;
  }

  const findLevel = (id: string) => {
    const level = levels.find((level) => level.id === id);
    return level;
  };

  const handleCardClick = (tuitionId: string) => {
    router.push(`/back/tuitions/${tuitionId}`);
  };

  return (
    <div>
      <div className="flex flex-col gap-2 justify-between items-center">
        {tuitions.length === 0 && (
          <div className="bg-white w-full border-1 border-grey-600 rounded-lg overflow-hidden p-4">
            <h1 className="flex justify-center font-normal text-gray-500">
              No Tuition Found
            </h1>
          </div>
        )}

        {tuitions
          // .filter((tuition) => {
          //     if (!filter) return true; // If filter is null, return all tuition objects
          //     const tuitionDate = new Date(tuition.startTime ?? "").toDateString();
          //     const filterDate = new Date(filter).toDateString();
          //     return tuitionDate === filterDate; // Compare the dates only
          //   })
          .map((tuition) => (
            <TuitionCard
              key={tuition.id}
              subject={findSubject(tuition.subjectId)}
              level={findLevel(tuition.levelId)}
              time={tuition.startTime ?? ""}
              duration={tuition.duration}
              status="Active"
              tutor={findTutor(tuition.tutorId)}
              student={findStudent(tuition.studentId)}
              price="Unset"
              meetingLink={tuition.url}
              onClick={() => handleCardClick(tuition.id ?? "")}
            />
          ))}
      </div>
    </div>
  );
};

export default TuitionList;