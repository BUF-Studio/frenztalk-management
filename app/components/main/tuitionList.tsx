"use client";

import TuitionCard from "@/app/components/general/tuitionCard";
import { Level } from "@/lib/models/level";
import PaginatedResult from "@/lib/models/paginationResult";
import Student from "@/lib/models/student";
import { Subject } from "@/lib/models/subject";
import type { Tuition } from "@/lib/models/tuition";
import { Tutor } from "@/lib/models/tutor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TuitionListProps = {
  tuitions: Tuition[];
  filter?: Date | null;
};

const TuitionList: React.FC<TuitionListProps> = ({ tuitions, filter }) => {
  const router = useRouter();
  // const { tutors } = useTutors();
  // const { students } = useStudents();
  // const { subjects } = useSubjects();
  // const { levels } = useLevels();

  const [tutors, setTutors] = useState<PaginatedResult<Tutor>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [students, setStudents] = useState<PaginatedResult<Student>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);

  useEffect(() => {
    fetchTutors()
    fetchStudents()
    fetchSubjects()
    fetchLevels()
  }, [])

  async function fetchStudents() {

    const response = await fetch(`/api/students`)
    const data = await response.json()
    setStudents(data)
  }
  async function fetchSubjects() {
    const response = await fetch(`/api/subjects`)
    const data = await response.json()
    setSubjects(data)
  }
  async function fetchLevels() {
    const response = await fetch(`/api/levels`)
    const data = await response.json()
    setLevels(data)
  }
  async function fetchTutors() {
    const response = await fetch(`/api/tutors`)
    const data = await response.json()
    setTutors(data)
  }

  const findSubject = (id: string) => {
    const subject = subjects?.find((subject) => subject.id === id);
    return subject?.name ?? "";
  };

  const findTutor = (id: string) => {
    const tutor = tutors.data.find((tutor) => tutor.id === id);
    return tutor;
  };

  const findStudent = (id: string) => {
    const student = students.data.find((student) => student.id === id);
    return student;
  };

  const findLevel = (id: string) => {
    const level = levels?.find((level) => level.id === id);
    return level;
  };

  const handleCardClick = (tuitionId: string) => {
    router.push(`/tuitions/${tuitionId}`);
  };

  const filteredTuitions = tuitions.filter((tuition) => {
    if (!filter) return true; // If filter is null, return all tuition objects
    const tuitionDate = new Date(tuition.startTime ?? "").toDateString();
    const filterDate = new Date(filter).toDateString();
    return tuitionDate === filterDate; // Compare the dates only
  });

  return (
    <div>
      <div className="flex flex-col gap-2 justify-between items-center">
        {filteredTuitions.length === 0 && (
          <div className="bg-white dark:bg-neutral-800 w-full border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden p-4">
            <h1 className="flex justify-center font-normal text-neutral-500 dark:text-neutral-400">
              No Tuition Found
            </h1>
          </div>
        )}

        {filteredTuitions.map((tuition) => (
          <TuitionCard
            key={tuition.id}
            subject={findSubject(tuition.subjectId)}
            level={findLevel(tuition.levelId)?.name}
            time={tuition.startTime ?? ""}
            duration={tuition.duration}
            status={tuition.status}
            tutor={findTutor(tuition.tutorId)?.name}
            student={findStudent(tuition.studentId)?.name}
            studentId={findStudent(tuition.studentId)?.id ?? ""}
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
