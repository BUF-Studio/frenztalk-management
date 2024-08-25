"use client";

import { DataTable } from "@/app/components/dashboard/DataTable";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useTutorPage } from "@/lib/context/page/tutorPageContext";
import type { Tutor } from "@/lib/models/tutor";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge, type BadgeProps } from "@/app/components/ui/badge";
import { capitalizeFirstLetter } from "@/utils/util";

export default function TutorList() {
  const { tutors } = useTutors();
  const { setTutor } = useTutorPage();

  const router = useRouter();

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

  const columns: { key: keyof Tutor; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "des", label: "Description" },
    { key: "status", label: "Status" },
  ];

  const viewTutor = (tutor: Tutor) => {
    setTutor(tutor);
    router.push(`/tutors/${tutor.id}`);
  };

  const renderTutorCell = (tutor: Tutor, columnKey: keyof Tutor) => {
    if (columnKey === "name") {
      return (
        <div className="">
          {tutor.pic ? (
            <Image
              src="/frenztalk-logo.jpg"
              alt="Frenztalk Logo"
              priority
              width={20}
              height={20}
            />
          ) : (
            <div className="" />
          )}
          <div>{tutor.name}</div>
        </div>
      );
    }

    if (columnKey === "status") {
      return (
        <Badge variant={getStatusVariant(tutor.status)}>
          {capitalizeFirstLetter(tutor.status)}
        </Badge>
      );
    }

    return tutor[columnKey] as React.ReactNode;
  };

  return (
    <div>
      <div className="flex flex-1 flex-row justify-between pb-4">
        <h1 className="text-xl font-bold">Tutor List</h1>
      </div>
      <DataTable
        data={tutors}
        columns={columns}
        actions={[]}
        onRowClick={(tutor) => viewTutor(tutor)}
        renderCell={renderTutorCell}
      />
    </div>
  );
}
