"use client";

import { useStudents } from "@/lib/context/collection/studentsContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useStudentPage } from "@/lib/context/page/studentPageContext";
import { useTutorPage } from "@/lib/context/page/tutorPageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TutorStudentList() {
  const { students } = useStudents();
  const { tutorStudent } = useTutorPage();
  const router = useRouter();

  const handleOnClick = (id: string) => {
    router.push(`/students/${id}`);
  };


  return (
    <div>
      <span className="flex text-lg font-normal mb-2">Recently taught</span>
      <div className="bg-white p-4 w-full border-1 border-grey-600 rounded-lg overflow-hidden">
        <div className="flex flex-col justify-between items-center">
          {tutorStudent.length === 0 && (
            <h1 className="flex justify-center font-normal text-gray-500">
              No Tutor Found
            </h1>
          )}
          {tutorStudent.map((student, index) => (
            <div key={student.id}>
              <div className="flex flex-row gap-2 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                  {/* If you have an image, you can add it here */}
                  {/* <img src={tutor.avatarUrl} alt={tutor.name} className="w-full h-full object-cover" /> */}
                </div>
                <div className="flex flex-col items-start">
                  <button
                    type="button"
                    onClick={() => {
                      handleOnClick(student.id ?? "");
                    }}
                    className="text-md font-semibold hover:underline hover:text-red-700"
                  >
                    {student.name}
                  </button>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    Hello there I am just bombing whatever to test out whjeterhr
                    this thing is working or not
                  </p>
                </div>
              </div>
              {index < tutorStudent.length - 1 && (
                <div className="border-b border-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}