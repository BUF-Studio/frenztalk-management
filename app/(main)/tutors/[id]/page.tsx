"use client";

import { useTutorPage } from "@/lib/context/page/tutorPageContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useTuitionPage } from "@/lib/context/page/tuitionPageContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowBackIosNew, Close } from "@mui/icons-material";
import { Edit } from "lucide-react";
import MonthCalendar from "@/app/components/dashboard/Calendar";
import { Badge, type BadgeProps } from "@/app/components/general/badge";
import { capitalizeFirstLetter } from "@/utils/util";
import TuitionList from "../../../components/main/tuitionList";
import { InvoiceList } from "@/app/components/main/invoiceList";
import { StudentList } from "@/app/components/main/studentList";

export default function TutorDetail({ params }: { params: { id: string } }) {
  const { tutorStudent, tutorTuition, tutor, setTutor } = useTutorPage();
  const { tutors } = useTutors();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { setTuitionTutor } = useTuitionPage();
  const router = useRouter();

  useEffect(() => {
    if (tutor === null || tutor.id !== params.id) {
      console.log('find tutor')
      const foundTutor = tutors.find((s) => s.id === params.id);
      console.log('tutor')
      if (foundTutor) setTutor(foundTutor);
    }
  }, [params,tutors,tutor]);

  const addTuition = () => {
    setTuitionTutor(tutor);
    router.push("/tuitions/add");
  };

  function getStatusVariant(status: string | undefined): BadgeProps["variant"] {
    if (!status) {
      return "error";
    }

    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "frozen":
        return "warning";
      default:
        return "error";
    }
  }

  return (
    <div>
      {/* Back Button */}
      <button
        type="button"
        onClick={(e) => {
          router.back();
        }}
        className="flex items-center text-gray-600 dark:text-neutral-400 hover:text-gray-800 dark:hover:text-neutral-200 transition-colors mb-4"
      >
        <ArrowBackIosNew className="h-5 w-5 mr-2" />
        <h1 className="text-lg font-semibold">Tutor Details</h1>
      </button>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Side */}
        <div className="flex-grow">
          <div className="bg-white dark:bg-neutral-800 border border-grey-600 dark:border-neutral-700 rounded-lg p-6 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-row gap-6 items-center">
                <div className="w-20 h-20 bg-gray-200 dark:bg-neutral-700 rounded-full flex items-center justify-center">
                  {/* Avatar placeholder */}
                </div>
                <div className="grid grid-row-2 gap-2">
                  <div className="flex flex-row gap-2">
                    <p className="text-lg font-semibold dark:text-neutral-100">
                      {tutor?.name}
                    </p>
                    <Badge variant={getStatusVariant(tutor?.status)}>
                      {capitalizeFirstLetter(tutor?.status)}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-neutral-400 font-semibolds">
                    {tutor?.des}
                  </p>
                </div>
              </div>
              <button
                className="flex flex-row items-center px-4 py-2 bg-red-800 dark:bg-red-700 text-white text-sm rounded-md font-semibold hover:bg-red-800/[0.8] dark:hover:bg-red-600 hover:shadow-lg transition-colors"
                type="button"
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
          <TuitionList tuitions={tutorTuition} filter={selectedDate} />
        </div>
        <div className="lg:w-[300px] flex-shrink-0 flex flex-col gap-4">
          <div>
            <MonthCalendar
              events={tutorTuition}
              onDateSelect={(date) => setSelectedDate(date)}
            />
          </div>
          <StudentList students={tutorStudent} />
          <div className="flex flex-1 h-full" />
        </div>
      </div>
    </div>
  );
}
