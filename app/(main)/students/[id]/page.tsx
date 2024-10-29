"use client";

import { ArrowBackIosNew, Close } from "@mui/icons-material";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MonthCalendar from "@/app/components/dashboard/Calendar";
import { Badge, type BadgeProps } from "@/app/components/general/badge";
import { InvoiceList } from "@/app/components/main/invoiceList";
import TuitionList from "@/app/components/main/tuitionList";
import { TutorList } from "@/app/components/main/tutorList";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { useStudentPage } from "@/lib/context/page/studentPageContext";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { capitalizeFirstLetter } from "@/lib/utils";

export default function StudentDetail({ params }: { params: { id: string } }) {
  const { student, studentInvoice, studentTuition, studentTutor, setStudent } =
    useStudentPage();
  const { students } = useStudents();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (student === null || student.id !== params.id) {
      const foundStudent = students.find((s) => s.id === params.id);
      if (foundStudent) setStudent(foundStudent);
    }
  }, [student, params, setStudent, students]);

  useEffect(() => {
    console.log(selectedDate?.toISOString());
  }, [selectedDate]);

  const addTuition = () => {
    // setTuitionStudent(student);
    router.push("/tuitions/add");
  };

  // const handleUpdateStudent = async (studentData: Partial<Student>) => {
  //   try {
  //     const updatedStudent: Student = {
  //       id: student?.id ?? null,
  //       age: studentData.age ?? 0,
  //       name: studentData.name ?? "",
  //       status: studentData.status ?? "active"
  //     }

  //     console.log(updatedStudent);

  //     const response = await fetch('/api/students', {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(updatedStudent)
  //     })

  //     if (response.ok) {
  //       showSnackbar("Successfully updated student", "success");
  //       toggleDialog();
  //     }
  //     // await updateStudent(updatedStudent);
  //   } catch (error) {
  //     showSnackbar("Error processing student", "error");
  //   }
  // };

  function getStatusVariant(status: string | undefined): BadgeProps["variant"] {
    if (!status) {
      // Handle the case where status is undefined or null
      return "destructive"; // or any appropriate fallback value
    }

    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "frozen":
        return "destructive";
      default:
        return "destructive";
    }
  }

  const handleEditStudent = () => {
    // setStudent(student);
    router.push(`/students/${student?.id}/update`);
  };

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
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">{`Age : ${student?.age}`}</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">{`Contact Number : ${student?.contact??''}`}</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">{`Parent Name : ${student?.parentName??''}`}</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">{`Parent Contact Number : ${student?.parentContact??''}`}</p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-semibold">{`Nationality : ${student?.nationality??''}`}</p>
                </div>
              </div>
              <button
                className="flex flex-row items-center px-4 py-2 bg-neutral-800 dark:bg-neutral-700 text-white text-sm rounded-md font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-600 hover:shadow-lg transition-colors"
                type="button"
                onClick={handleEditStudent}
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
          {student?.id && (
            <InvoiceList invoices={studentInvoice} studentId={student?.id} />
          )}
          <div className="flex flex-1 h-full" />
        </div>
      </div>
    </div>
  );
}
