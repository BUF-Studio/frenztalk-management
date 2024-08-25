"use client";

import { useTutorPage } from "@/lib/context/page/tutorPageContext";
import Link from "next/link";
import TutorInvoiceList from "./tutorInvoiceList";
import TutorTuitionList from "./tutorTuitionList";
import { useTutors } from "@/lib/context/collection/tutorContext";
import TutorStudentList from "./tutorStudentList";
import { useTuitionPage } from "@/lib/context/page/tuitionPageContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowBackIosNew } from "@mui/icons-material";
import { Edit } from "lucide-react";
import MonthCalendar from "@/app/components/dashboard/Calendar";
import StudentInvoiceList from "../../students/[id]/studentInvoiceList";
import StudentTuitionList from "../../students/[id]/studentTuitionList";
import StudentTutorList from "../../students/[id]/studentTutorList";
import { Badge, type BadgeProps } from "@/app/components/ui/badge";
import { capitalizeFirstLetter } from "@/utils/util";

export default function TutorDetail({ params }: { params: { id: string } }) {
  const { tutorTuition, tutor, setTutor } = useTutorPage();
  const { tutors } = useTutors();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { setTuitionTutor } = useTuitionPage();
  const router = useRouter();

  useEffect(() => {
    if (tutor === null || tutor.id !== params.id) {
      const foundTutor = tutors.find((s) => s.id === params.id);
      if (foundTutor) setTutor(foundTutor);
    }
  }, [tutor, tutors, params, setTutor]);

  const addTuition = () => {
    setTuitionTutor(tutor);
    router.push("/back/tuitions/add");
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
        return "warning";
      // Add other cases as needed
      default:
        return "error"; // Handle unexpected statuses
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
        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
      >
        <ArrowBackIosNew className="h-5 w-5 mr-2" />
        <h1 className="text-lg font-semibold">Tutor Details</h1>
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
                <div className="grid grid-row-2 gap-2">
                  <div className="flex flex-row gap-2">
                    <p className="text-lg font-semibold">{tutor?.name}</p>
                    <Badge variant={getStatusVariant(tutor?.status)}>{capitalizeFirstLetter(tutor?.status)}</Badge>
                  </div>
                  <p className="text-xs text-gray-600 font-semibolds">
                    {tutor?.des}
                  </p>
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
          <TutorTuitionList />
        </div>
        <div className="lg:w-[300px] flex-shrink-0 flex flex-col gap-4">
          <div>
            <MonthCalendar
              events={tutorTuition}
              onDateSelect={(date) => setSelectedDate(date)}
            />
          </div>
          <TutorStudentList />
          <TutorInvoiceList />
          <div className="flex flex-1 h-full" />
        </div>
      </div>
    </div>
  );
}
