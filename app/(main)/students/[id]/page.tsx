"use client";

import { ArrowBackIosNew, Close } from "@mui/icons-material";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import StudentDialog from "../components/studentForm";
// import { updateStudent } from "@/lib/firebase/student";
import { Badge, type BadgeProps } from "@/app/components/general/badge";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import Student from "@/lib/models/student";
import { capitalizeFirstLetter } from "@/utils/util";
import { Invoice } from "@/lib/models/invoice";
import { Tutor } from "@/lib/models/tutor";
import { Tuition } from "@/lib/models/tuition";
import TuitionList from "@/app/components/main/tuitionList";
import MonthCalendar from "@/app/components/dashboard/Calendar";
import { TutorList } from "@/app/components/main/tutorList";
import { InvoiceList } from "@/app/components/main/invoiceList";
import PaginatedResult from "@/lib/models/paginationResult";

// interface StudentDetailDataProps{
//   student:Student,
//   invoices :Invoice[],
//   tutors :Tutor[],
//   tuition :Tuition[]
// }

export default function StudentDetail({ params }: { params: { id: string } }) {
  // const { student, setStudent } = useStudentPage();
  // const { students } = useStudents();
  // const studentInvoice: Invoice[] = [];
  // const studentTutor: Tutor[] = [];
  // const studentTuition: Tuition[] = [];
  // const { studentTuition, studentTutor, studentInvoice } = ([],[],[]);
  // const { studentTuition, studentTutor, studentInvoice } = ([],[],[]);
  // const { setTuitionStudent } = useTuitionPage();
  const [student, setStudent] = useState<Student>()
  const [tutors, setTutors] = useState<PaginatedResult<Tutor>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [tuitions, setTuitions] = useState<PaginatedResult<Tuition>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [invoices, setInvoices] = useState<PaginatedResult<Invoice>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { showSnackbar } = useSnackbar();

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  useEffect(() => {
    fetchStudent()
    fetchTutors()
    fetchTuitions()
    fetchInvoices()
  }, [])

  async function fetchStudent() {

    const response = await fetch(`/api/students?id=${params.id}`)
    const data = await response.json()
    setStudent(data)
  }
  async function fetchTuitions() {
    const response = await fetch(`/api/tuitions?studentId=${params.id}`)
    const data = await response.json()
    setTuitions(data)
  }
  async function fetchTutors() {
    const response = await fetch(`/api/tutors?studentId=${params.id}`)
    const data = await response.json()
    console.log('tutors')
    console.log(data)
    setTutors(data)
  }
  async function fetchInvoices() {
    const response = await fetch(`/api/invoices?studentId=${params.id}`)
    const data = await response.json()
    setInvoices(data)
  }



  // useEffect(() => {
  //   if (student === null || student.id !== params.id) {
  //     const foundStudent = students.find((s) => s.id === params.id);
  //     if (foundStudent) setStudent(foundStudent);
  //   }
  // }, [student, params, students, setStudent]);

  useEffect(() => {
    console.log(selectedDate?.toISOString());
  }, [selectedDate]);

  const addTuition = () => {
    // setTuitionStudent(student);
    router.push("/tuitions/add");
  };

  const handleUpdateStudent = async (studentData: Partial<Student>) => {
    try {
      const updatedStudent: Student = {
        id: student?.id ?? null,
        age: studentData.age ?? 0,
        name: studentData.name ?? "",
        status: studentData.status ?? "active"
      }

      console.log(updatedStudent);

      const response = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStudent)
      })

      if (response.ok) {
        showSnackbar("Successfully updated student", "success");
        toggleDialog();
      }
      // await updateStudent(updatedStudent);
    } catch (error) {
      showSnackbar("Error processing student", "error");
    }
  };

  function getStatusVariant(status: string | undefined): BadgeProps["variant"] {
    if (!status) {
      // Handle the case where status is undefined or null
      return 'destructive'; // or any appropriate fallback value
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
          <TuitionList tuitions={tuitions.data} filter={selectedDate} />
        </div>
        <div className="lg:w-[300px] flex-shrink-0 flex flex-col gap-4">
          <div>
            <MonthCalendar
              events={tuitions.data}
              onDateSelect={(date) => setSelectedDate(date)}
              onResetDateSelect={selectedDate === null}
            />
          </div>
          <TutorList tutors={tutors.data} />
          <InvoiceList invoices={invoices.data} studentId={student?.id!} />
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
