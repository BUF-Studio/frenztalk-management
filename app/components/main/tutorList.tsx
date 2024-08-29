"use client";

import { useRouter } from "next/navigation";
import type { Tutor } from "@/lib/models/tutor";
import Image from "next/image";

interface TutorsProps {
  tutors?: Tutor[];
}

export const TutorList: React.FC<TutorsProps> = ({ tutors }) => {
  const router = useRouter();

  const handleOnClick = (id: string) => {
    router.push(`/tutors/${id}`);
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="flex text-lg font-normal dark:text-neutral-200">Tutor Assigned</span>
      <div className="bg-white dark:bg-neutral-800 p-4 w-full border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden">
        <div className="flex flex-col">
          {(!tutors || tutors.length === 0) ? (
            <h1 className="text-center font-normal text-gray-500 dark:text-neutral-400">
              No Tutor Found
            </h1>
          ) : (
            tutors.map((tutor, index) => (
              <div key={tutor.id} className="">
                <div className="flex items-start gap-4">
                  <div className="relative w-12 h-12 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden flex-shrink-0">
                    {tutor.pic && (
                      <Image
                        src={tutor.pic}
                        alt={tutor.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-full"
                      />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => handleOnClick(tutor?.id ?? '')}
                      className="text-md font-semibold hover:underline hover:text-red-700 dark:hover:text-red-500 text-left dark:text-neutral-100"
                    >
                      {tutor.name}
                    </button>
                    <p className="text-gray-500 dark:text-neutral-400 text-sm line-clamp-2">
                      Hello there I am just bombing whatever to test out whether
                      this thing is working or not
                    </p>
                  </div>
                </div>
                {index < (tutors.length - 1) && (
                  <div className="my-2 border-b border-gray-200 dark:border-neutral-700" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};