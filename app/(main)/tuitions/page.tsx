"use client";

import { useTuitions } from "@/lib/context/collection/tuitionContext";
import { useTuitionPage } from "@/lib/context/page/tuitionPageContext";
import type { Tuition } from "@/lib/models/tuition";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MonthCalendar from "@/app/components/dashboard/Calendar";
import { useState } from "react";
import TuitionList from "./tuitionList";
import { Plus } from "lucide-react";

export default function TuitionPage() {
  const { tuitions } = useTuitions();
  const router = useRouter();
  const { setTuition } = useTuitionPage();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const addTuition = () => {
    setTuition(null);
    router.push("/tuitions/add");
  };
  const viewTuition = (tuition: Tuition) => {
    setTuition(tuition);
    router.push(`/tuitions/${tuition.id}`);
  };

  // const zoom = async () => {
  //     try {
  //         const response = await axios.post<MeetingData>('/api/addZoom', {
  //             topic: "Hello",
  //             start_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
  //             duration: 60,
  //             password: null,
  //         });

  //         console.log(response.data);
  //         console.log(response.data.join_url);
  //     } catch (error) {
  //         console.error(error);
  //     }
  // }

  // const zoomAuth = () => {
  //     window.location.href = '/api/auth/authorize';
  //   };

  return (
    <div className="flex flex-1 h-full w-full flex-row gap-4 justify-start items-start overflow-hidden">
      <div className="flex flex-col flex-1">
        <MonthCalendar
          events={tuitions}
          onDateSelect={(date) => setSelectedDate(date)}
        />
        <div className="flex flex-1 flex-grow" />
      </div>
      <div className="w-[460px] h-full flex-shrink-0 flex flex-col overflow-y-auto">
        <div className="flex flex-row justify-between items-center mb-2">
          <h1 className="text-lg font-normal">Classes</h1>
          <button
            className="flex flex-row items-center px-4 py-2  bg-red-800 text-white text-sm rounded-md font-semibold hover:bg-red-800/[0.8] hover:shadow-lg"
            type="button"
            onClick={addTuition}
          >
            <Plus size={16} strokeWidth={3} className="mr-1" />
            Add Class
          </button>
        </div>
        <TuitionList tuitions={tuitions} />
      </div>
    </div>
  );
}