"use client";

import { useStudents } from "@/lib/context/collection/studentsContext";
import { useStudentPage } from "@/lib/context/page/studentPageContext";
import { useTuitionPage } from "@/lib/context/page/tuitionPageContext";
import { useRouter } from "next/navigation";
import { ArrowBackIosNew, Close } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Edit } from "lucide-react";
import StudentDialog from "../studentForm";
import { Student } from "@/lib/models/student";
import { updateStudent } from "@/lib/firebase/student";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import MonthCalendar from "@/app/components/dashboard/Calendar";
import { Badge, type BadgeProps } from "@/app/components/ui/badge";
import { capitalizeFirstLetter } from "@/utils/util";
import TuitionList from "../../../components/main/tuitionList";
import { TutorList } from "@/app/components/main/tutorList";
import { InvoiceList } from "@/app/components/main/invoiceList";

export default function StudentDetail({ params }: { params: { id: string } }) {
  const { student, setStudent } = useStudentPage();
  const { students } = useStudents();
  const { studentTuition, studentTutor, studentInvoice } = useStudentPage();
  const { setTuitionStudent } = useTuitionPage();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { showSnackbar } = useSnackbar();

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  useEffect(() => {
    if (student === null || student.id !== params.id) {
      const foundStudent = students.find((s) => s.id === params.id);
      if (foundStudent) setStudent(foundStudent);
    }
  }, [params, student, students, setStudent]);

  useEffect(() => {
    console.log(selectedDate?.toISOString());
  }, [selectedDate]);

  const addTuition = () => {
    setTuitionStudent(student);
    router.push("/tuitions/add");
  };

  const handleUpdateStudent = async (studentData: Partial<Student>) => {
    try {
      const updatedStudent = new Student(
        student?.id ?? null,
        studentData.name ?? "",
        studentData.age ?? 0,
        studentData.status ?? "active"
      );
      console.log(updatedStudent);
      await updateStudent(updatedStudent);
      showSnackbar("Successfully updated student", "success");
      toggleDialog();
    } catch (error) {
      showSnackbar("Error processing student", "error");
    }
  };

  function getStatusVariant(status: string | undefined): BadgeProps["variant"] {
    if (!status) {
      // Handle the case where status is undefined or null
      return "error"; // or any appropriate fallback value
    }

    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "frozen":
        return "error";
      default:
        return "error";
    }
  }

  return (
    <div className="dark:transparent dark:text-neutral-100">
      {/* Back Button */}
      <button
        type="button"
        onClick={(e) => {
          router.back();
        }}
        className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors mb-4"
      >
        <ArrowBackIosNew className="h-5 w-5 mr-2" />
        <h1 className="text-lg font-semibold">Student Details</h1>
      </button>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Side */}
        <div className="flex-grow">
          <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-row gap-6 items-center">
                <div className="w-20 h-20 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center">
                  {/* Avatar placeholder */}
                </div>
                <div className="grid grid-row-2 gap-2">
                  <div className="flex flex-row gap-2">
                    <p className="text-lg font-semibold dark:text-neutral-100">
                      {student?.name}
                    </p>
                    <Badge variant={getStatusVariant(student?.status)}>
                      {capitalizeFirstLetter(student?.status)}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">{`Aged ${student?.age}`}</p>
                </div>
              </div>
              <button
                className="flex flex-row items-center px-4 py-2 bg-neutral-800 dark:bg-neutral-700 text-white text-sm rounded-md font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-600 hover:shadow-lg transition-colors"
                type="button"
                onClick={toggleDialog}
              >
                <Edit size={16} strokeWidth={3} className="mr-1" />
                Edit
              </button>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center mb-2">
            <h1 className="text-lg font-normal dark:text-neutral-200">
              Classes
            </h1>
            <div className="flex flex-row gap-2 items-center">
              <div className="dark:text-neutral-400">Filter:</div>
              {selectedDate ? (
                <button
                  className="flex flex-row h-10 gap-1 items-center px-2 py-2 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm rounded-md font-normal hover:shadow-lg transition-colors"
                  type="button"
                  onClick={() => setSelectedDate(null)}
                >
                  {selectedDate.toDateString()}
                  <Close className="text-neutral-500 dark:text-neutral-400" />
                </button>
              ) : (
                <div className="flex flex-row h-10 items-center px-4 py-2 bg-transparent text-neutral-700 dark:text-neutral-300 text-sm rounded-md font-semibold">
                  None
                </div>
              )}
            </div>
          </div>
          {/* <StudentTuitionList filter={selectedDate} /> */}
          <TuitionList tuitions={studentTuition} filter={selectedDate} />
        </div>
        <div className="lg:w-[300px] flex-shrink-0 flex flex-col gap-4">
          <div>
            <MonthCalendar
              events={studentTuition}
              onDateSelect={(date) => setSelectedDate(date)}
              onResetDateSelect={selectedDate === null}
            />
          </div>
          <TutorList tutors={studentTutor} />
          <InvoiceList invoices={studentInvoice} />
          <div className="flex flex-1 h-full" />
        </div>
      </div>
      <StudentDialog
        isOpen={isDialogOpen}
        onClose={toggleDialog}
        onSubmit={handleUpdateStudent}
        initialStudent={student}
      />
    </div>
  );
}
