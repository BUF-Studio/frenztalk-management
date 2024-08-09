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
import { use, useEffect } from "react";
import { Edit } from "lucide-react";

export default function StudentDetail({ params }: { params: { id: string } }) {
  const { student, setStudent } = useStudentPage();
  const { students } = useStudents();
  const { setTuitionStudent } = useTuitionPage();
  const router = useRouter();

  useEffect(() => {
    if (student === null || student.id !== params.id) {
      const foundStudent = students.find((s) => s.id === params.id);
      if (foundStudent) setStudent(foundStudent);
    }
  }, [params, student, students, setStudent]);

  const addTuition = () => {
    setTuitionStudent(student);
    router.push("/back/tuitions/add");
  };

  return (
    <div>
      {/* Back Button */}
      <button
        type="button"
        onClick={(e) => {
          router.back();
        }}
        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
      >
        <ArrowBackIosNew className="h-5 w-5 mr-2" />
        <h1 className="text-lg font-semibold">Student Details</h1>
      </button>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Side */}
        <div className="flex-grow">
          <div className="bg-white border-1 border-grey-600 rounded-lg p-6 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-row gap-6 items-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  {/* <span className="text-gray-500 text-xl">Avatar</span> */}
                </div>
                <div className="grid grid-row-2">
                  <p className="text-lg font-semibold">{student?.name}</p>
                  <p className="text-xs text-gray-600 font-semibolds">{`Aged ${student?.age}`}</p>
                </div>
              </div>
              <button
                className="flex flex-row items-center px-4 py-2  bg-red-800 text-white text-sm rounded-md font-semibold hover:bg-red-800/[0.8] hover:shadow-lg"
                type="button"
              >
                <Edit size={16} strokeWidth={3} className="mr-1" />
                Edit
              </button>
            </div>
          </div>
          <StudentTuitionList />
        </div>
        <div className="lg:w-[300px] flex-shrink-0 flex flex-col gap-4">
          <StudentTutorList />
          <StudentInvoiceList />
        </div>
      </div>
    </div>
  );
}
