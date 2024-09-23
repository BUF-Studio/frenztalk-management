"use client";

import TuitionCard from "@/app/components/general/tuitionCard";
import { useLevels } from "@/lib/context/collection/levelContext";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { Invoice } from "@/lib/models/invoice";
import { Level } from "@/lib/models/level";
import { Subject } from "@/lib/models/subject";
import type { Tuition } from "@/lib/models/tuition";
import { Tutor } from "@/lib/models/tutor";
import { useRouter } from "next/navigation";
import { MouseEvent, useEffect, useState } from "react";
import UnpaidInvoiceCard from "../general/unpaidInvoiceCard";
import { updateStudent } from "@/lib/firebase/student";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { deleteTuition } from "@/lib/firebase/tuition";

type TuitionListProps = {
  unpaidInvoiceList: Invoice[];
  tuitions: Tuition[];
};

const UnpaidWarningList: React.FC<TuitionListProps> = ({
  unpaidInvoiceList,
  tuitions,
}) => {
  const router = useRouter();
  const { tutors } = useTutors();
  const { students } = useStudents();
  const { subjects } = useSubjects();
  const { levels } = useLevels();
  const { showSnackbar } = useSnackbar();

  const findSubject = (id: string) => {
    const subject = subjects?.find((subject) => subject.id === id);
    return subject?.name ?? "";
  };

  const findTutor = (id: string) => {
    const tutor = tutors.find((tutor) => tutor.id === id);
    return tutor;
  };

  const findStudent = (id: string) => {
    const student = students.find((student) => student.id === id);
    return student;
  };

  const handleCardClick = () => {
    // router.push(`/tuitions/${tuitionId}`);
  };

  const freezeStudent = async (
    studentId: string,
    e: MouseEvent<Element, MouseEvent>
  ) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      try {
        var tempStudent = findStudent(studentId);
        if (tempStudent) {
          tempStudent.status == "frozen"
            ? (tempStudent.status = "active")
            : (tempStudent.status = "frozen");
          //TODO : make this transactional, rollback the changes when something failed in the mid way
          await updateStudent(tempStudent);

          var freezedStudentFutureClasses = tuitions.filter(
            (tuition) =>
              new Date(tuition.startTime) > new Date(Date.now()) &&
              tuition.studentId == studentId
          );
          freezedStudentFutureClasses.forEach(async (tuitionClass) => {
            await deleteTuition(tuitionClass);
          });
        } else {
          throw new Error("Failed to freeze the student");
        }
      } catch (err) {
        showSnackbar("Error: ", "error");
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-2 justify-between items-center">
        {unpaidInvoiceList.length === 0 && (
          <div className="bg-white dark:bg-neutral-800 w-full border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden p-4">
            <h1 className="flex justify-center font-normal text-neutral-500 dark:text-neutral-400">
              No Unpaid Invoice Found
            </h1>
          </div>
        )}

        {unpaidInvoiceList.map((unpaidInvoice) => (
          <UnpaidInvoiceCard
            key={unpaidInvoice.id}
            subject={findSubject(unpaidInvoice.subjectId)}
            startDate={unpaidInvoice.startDateTime}
            duration={unpaidInvoice.duration}
            status={unpaidInvoice.status}
            tutor={findTutor(unpaidInvoice.tutorId)?.name}
            student={findStudent(unpaidInvoice.studentId)?.name}
            studentStatus={findStudent(unpaidInvoice.studentId)?.status}
            studentId={findStudent(unpaidInvoice.studentId)?.id ?? ""}
            price={unpaidInvoice.price}
            currency={unpaidInvoice.currency}
            freezeStudent={freezeStudent}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
};

export default UnpaidWarningList;
