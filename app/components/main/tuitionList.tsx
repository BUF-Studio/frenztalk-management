"use client"

import { useRouter } from "next/navigation"
import { Separator } from "@/app/components/ui/separator"
import { useLevels } from "@/lib/context/collection/levelContext"
import { useStudents } from "@/lib/context/collection/studentsContext"
import { useSubjects } from "@/lib/context/collection/subjectContext"
import { useTutors } from "@/lib/context/collection/tutorContext"
import type { Tuition } from "@/lib/models/tuition"
import TuitionCard from "../general/tuitionCard"
import { utcToLocal } from "@/utils/util"

type TuitionListProps = {
  tuitions: Tuition[]
  filter?: Date | null
}

export default function TuitionList({ tuitions, filter }: TuitionListProps) {
  const router = useRouter()
  const { tutors } = useTutors()
  const { students } = useStudents()
  const { subjects } = useSubjects()
  const { levels } = useLevels()

  const findSubject = (id: string) => subjects?.find((subject) => subject.id === id)?.name ?? ""
  const findTutor = (id: string) => tutors.find((tutor) => tutor.id === id)
  const findStudent = (id: string) => students.find((student) => student.id === id)
  const findLevel = (id: string) => levels?.find((level) => level.id === id)

  const handleCardClick = (tuitionId: string) => router.push(`/tuitions/${tuitionId}`)

  const filteredTuitions = tuitions.filter((tuition) => {
    if (!filter) return true
    const tuitionDate = new Date(tuition.startTime ?? "").toUTCString().split(' ').slice(0, 4).join(' ')
    const filterDate = filter.toUTCString().split(' ').slice(0, 4).join(' ')
    return tuitionDate === filterDate
  })


  const now = new Date()
  const utcNow = new Date(now.toUTCString())
  const in24Hours = new Date(utcNow.getTime() + 24 * 60 * 60 * 1000)

  const pastTuitions = filteredTuitions.filter((tuition) => {
    const startTime = utcToLocal(tuition.startTime);
    const endTime = new Date(startTime.getTime() + tuition.duration * 60000);

    return endTime < utcNow
  })

  const upcomingTuitions = filteredTuitions.filter((tuition) => {
    const startTime = utcToLocal(tuition.startTime);
    const endTime = new Date(startTime.getTime() + tuition.duration * 60000);
    return endTime >= utcNow && startTime <= in24Hours
  })

  const otherTuitions = filteredTuitions.filter((tuition) => {
    const startTime = utcToLocal(tuition.startTime);
    return startTime > in24Hours
  })

  const renderTuitionCards = (tuitions: Tuition[]) => {
    return tuitions.map((tuition) => (
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
    ))
  }

  return (
    <div className="grid gap-4">
      {pastTuitions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Past Tuitions</h2>
          <div className="flex flex-col gap-2">{renderTuitionCards(pastTuitions)}</div>
        </div>
      )}

      {pastTuitions.length > 0 && (upcomingTuitions.length > 0 || otherTuitions.length > 0) && <Separator />}

      {upcomingTuitions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Upcoming Tuitions</h2>
          <div className="flex flex-col gap-2">{renderTuitionCards(upcomingTuitions)}</div>
        </div>
      )}

      {upcomingTuitions.length > 0 && otherTuitions.length > 0 && <Separator />}

      {otherTuitions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Future Tuitions</h2>
          <div className="flex flex-col gap-2">{renderTuitionCards(otherTuitions)}</div>
        </div>
      )}

      {filteredTuitions.length === 0 && (
        <div className="bg-white dark:bg-neutral-800 w-full border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden p-4">
          <h1 className="flex justify-center font-normal text-neutral-500 dark:text-neutral-400">
            No Tuition Found
          </h1>
        </div>
      )}
    </div>
  )
}