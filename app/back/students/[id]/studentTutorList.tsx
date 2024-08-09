"use client";

import Devider from "@/app/components/ui/devider";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useStudentPage } from "@/lib/context/page/studentPageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudentTutorList() {
  const { studentTutor } = useStudentPage();
  const router = useRouter();

  const handleOnClick = (id: string) => {
    router.push(`/back/tutors/${id}`);
  };

  return (
    <div className="bg-white px-4 pt-4 w-full border-1 border-grey-600 rounded-lg overflow-hidden">
      <span className="flex text-lg font-normal">Earlier taught by</span>
      <div className="flex flex-col justify-between">
        {studentTutor.length === 0 && (
          <h1 className="flex justify-center font-normal text-gray-500">
        NOBODY!
          </h1>
        )}
        {studentTutor.map((tutor, index) => (
          <div key={tutor.id}>
            <div className="flex flex-row gap-2 items-start py-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                {/* If you have an image, you can add it here */}
                {/* <img src={tutor.avatarUrl} alt={tutor.name} className="w-full h-full object-cover" /> */}
              </div>
              <div className="flex flex-col items-start">
                <button
                  type="button"
                  onClick={() => {
                    handleOnClick(tutor.id ?? "");
                  }}
                  className="text-md font-semibold hover:underline hover:text-red-700"
                >
                  {tutor.name}
                </button>
                <p className="text-gray-500 text-sm line-clamp-2">
                  Hello there I am just bombing whatever to test out whjeterhr
                  this thing is working or not
                </p>
              </div>
            </div>
            {index < studentTutor.length - 1 && (
              <div className="border-b border-gray-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
