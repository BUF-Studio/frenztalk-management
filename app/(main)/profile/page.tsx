"use client";

import { useTutors } from "@/lib/context/collection/tutorContext";
import { useTuitionPage } from "@/lib/context/page/tuitionPageContext";
import { useTutorPage } from "@/lib/context/page/tutorPageContext";
import { ArrowBackIosNew } from "@mui/icons-material";
import { Edit } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MonthCalendar from "@/app/components/dashboard/Calendar";
import TutorStudentList from "../tutors/[id]/tutorStudentList";
import TutorInvoiceList from "../tutors/[id]/tutorInvoiceList";
import { useAuth } from "@/lib/context/AuthContext";
import { auth } from "firebase-admin";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/service/clientApp";
import Image from "next/image";

export default function ProfilePage({ params }: { params: { id: string } }) {
  const authContext = useAuth();
  const { tutorTuition, tutor, setTutor } = useTutorPage();
  const { tutors } = useTutors();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { setTuitionTutor } = useTuitionPage();
  //   const router = useRouter();
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    if (authContext.user) {
      console.log("check user " + authContext.user.uid);
      console.log("check email " + authContext.user.email);
      console.log("check role " + authContext.role);

      const docRef = doc(db, "tutors", authContext.user.uid);
    }
  }, [authContext]);

  useEffect(() => {
    if (tutor === null || tutor.id !== params.id) {
      const foundTutor = tutors.find((s) => s.id === params.id);
      if (foundTutor) setTutor(foundTutor);
    }
  }, [tutor, tutors, params, setTutor]);

  return (
    <div>
      {/* Back Button */}
      <button
        type="button"
        // onClick={(e) => {
        //   router.back();
        // }}
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
                  <img
                    src={authContext.user?.photoURL ?? "/account-darkmode.png"}
                    alt="avatar"
                    className="w-20 h-20 object-cover rounded-full"
                  />
                </div>
                <div className="grid grid-row-2">
                  <p className="text-lg font-semibold">
                    {authContext.user?.displayName}
                  </p>
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
          {authContext.role === "tutor" && <TutorTuitionList />}
        </div>

        <div className="lg:w-[300px] flex-shrink-0 flex flex-col gap-4">
          <div>
            <MonthCalendar
              events={tutorTuition}
              onDateSelect={(date) => setSelectedDate(date)}
            />
          </div>
          {authContext.role === "tutor" && <TutorStudentList />}
          <TutorInvoiceList />
          <div className="flex flex-1 h-full" />
        </div>
      </div>
    </div>
  );
}
