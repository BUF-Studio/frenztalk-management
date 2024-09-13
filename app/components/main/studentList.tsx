"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Student from "@/lib/models/student";

interface StudentsProps {
  students?: Student[];
}

export const StudentList: React.FC<StudentsProps> = ({ students }) =>{
  const router = useRouter();

  const handleOnClick = (id: string) => {
    router.push(`/students/${id}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="flex text-lg font-normal dark:text-neutral-200">Student Taught</span>
      <div className="bg-white dark:bg-neutral-800 p-4 w-full border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden">
        <div className="flex flex-col">
          {(!students || students.length === 0) ? (
            <h1 className="text-center font-normal text-gray-500 dark:text-neutral-400">
              No student Found
            </h1>
          ) : (
            students.map((student, index) => (
              <div key={student.id} className="mb-4 last:mb-0">
                <div className="flex items-start gap-4">
                  <div className="relative w-12 h-12 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden flex-shrink-0">
                    {/* {student. && (
                      <Image
                        src={student.pic}
                        alt={student.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    )} */}
                  </div>
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => handleOnClick(student?.id ?? '')}
                      className="text-md font-semibold hover:underline hover:text-red-700 dark:hover:text-red-500 text-left dark:text-neutral-100"
                    >
                      {student.name}
                    </button>
                    <p className="text-gray-500 dark:text-neutral-400 text-sm line-clamp-2">
                      Hello there I am just bombing whatever to test out whether
                      this thing is working or not
                    </p>
                  </div>
                </div>
                {index < (students.length - 1) && (
                  <div className="my-2 border-b border-gray-200 dark:border-neutral-700" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );}
