"use client";

import { DataTable } from "@/app/components/dashboard/DataTable";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useTutorPage } from "@/lib/context/page/tutorPageContext";
import type { Tutor } from "@/lib/models/tutor";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge, type BadgeProps } from "@/app/components/general/badge";
import { capitalizeFirstLetter } from "@/utils/util";
import React from "react";
import { useTableColumn } from "@/lib/general_hooks/useTableColumn";
import { TableOrderEnum } from "@/lib/enums/TableOrderEnum";

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

  const initialColumns: { key: keyof Tutor; label: string; order: string }[] = [
    { key: "id", label: "ID", order: TableOrderEnum.NONE },
    { key: "name", label: "Name", order: TableOrderEnum.NONE },
    { key: "des", label: "Description", order: TableOrderEnum.NONE },
    { key: "status", label: "Status", order: TableOrderEnum.NONE },
  ];

  const [columns, setColumns] = React.useState(initialColumns);

  const { sortedData: sortedTutors, sortColumn: sortTutorByColumn } =
    useTableColumn(tutors, columns, setColumns);

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
        data={sortedTutors}
        columns={columns}
        actions={[]}
        onRowClick={(tutor) => viewTutor(tutor)}
        onColumnClick={(column) => sortTutorByColumn(column, columns)}
        renderCell={renderTutorCell}
      />
    </div>
  );
}
