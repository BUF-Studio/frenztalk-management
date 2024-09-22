"use client";

import type { Tutor } from "@/lib/models/tutor";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { DataTable } from "@/app/components/ui/data-table";
import { columns } from "./columns";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useRouter } from "next/navigation";
import { useTutorPage } from "@/lib/context/page/tutorPageContext";

export default function TutorList() {

  const {tutors} = useTutors();
  const { setTutor } = useTutorPage();
  const router = useRouter();

  return (
    <div>
      <div className="flex flex-1 flex-row justify-between items-center pb-4">
        <h1 className="text-xl font-bold">Tutor List</h1>
        <div className="flex flex-row items-center space-x-4"/>
      </div>
      <DataTable
        columns={columns}
        data={tutors}
        getRowHref={(tutor) => {
          router.push(`/tutors/${tutor.id}`);
          setTutor(tutor);
        }}
        />
    </div>
  );
}
