"use client";

import { useStudents } from "@/lib/context/collection/studentsContext";
import { useStudentPage } from "@/lib/context/page/studentPageContext";
import Link from "next/link";
import StudentTutorList from "./studentTutorList";
import StudentTuitionList from "./studentTuitionList";
import StudentInvoiceList from "./studentInvoiceList";
import { useTuitionPage } from "@/lib/context/page/tuitionPageContext";
import { useRouter } from "next/navigation";
import { ArrowBackIosNew } from "@mui/icons-material";

export default function StudentDetail({ params }: { params: { id: string } }) {
  const { student, setStudent } = useStudentPage();
  const { students } = useStudents();
  const { setTuitionStudent } = useTuitionPage();
  const router = useRouter();

  if (student === null || student.id !== params.id) {
    const foundStudent = students.find((s) => s.id === params.id);
    if (foundStudent) setStudent(foundStudent);
  }

  if (student === null) {
    return (
      <div>
        <h1>Student Not Found</h1>

        <button
          onClick={(e) => {
            router.back();
          }}
        >
          Back
        </button>
      </div>
    );
  }

  const addTuition = () => {
    setTuitionStudent(student);
    router.push(`/back/tuitions/add`);
  };

  return (
    <div>
      <button
        type="button"
        onClick={(e) => {
          router.back();
        }}
        className="flex flex-row items-center gap-2 pb-4"
      >
        <ArrowBackIosNew className="h-6 w-6" />
        <h1 className="text-xl font-bold">Student Details</h1>
      </button>
      <div>
        <p>Name: {student.name}</p>
        <p>Age: {student.age}</p>
        <Link href={`/back/students/${student.id}/edit`}>
          <button>Edit</button>
        </Link>
      </div>
      <button onClick={addTuition}>Add Class</button>
      <StudentTuitionList></StudentTuitionList>
      <StudentTutorList></StudentTutorList>
      <StudentInvoiceList></StudentInvoiceList>
    </div>
  );
}
