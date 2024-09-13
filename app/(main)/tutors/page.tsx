"use client";

import { DataTable } from "@/app/components/dashboard/DataTable";
import type { Tutor } from "@/lib/models/tutor";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge, type BadgeProps } from "@/app/components/general/badge";
import { capitalizeFirstLetter } from "@/utils/util";
import React, { useEffect, useState } from "react";
import { useTableColumn } from "@/lib/general_hooks/useTableColumn";
import { TableOrderEnum } from "@/lib/enums/TableOrderEnum";
import { useSearchTableData } from "@/lib/general_hooks/useSearchTableData";
import { SearchBar } from "@/app/components/general/input/searchBar";
import PaginatedResult from "@/lib/models/paginationResult";

export default function TutorList() {
  // const { tutors } = useTutors();
  // const { setTutor } = useTutorPage();
  const [tutors, setTutors] = useState<PaginatedResult<Tutor>>({ data: [], total: 0, page: 1, pageSize: 10 })

  useEffect(() => {
    fetchTutors()
  }, [])

  async function fetchTutors(page = 1, pageSize = 10) {
    const response = await fetch(`/api/tutors?page=${page}&pageSize=${pageSize}`)
    const data = await response.json()
    console.log(data)
    setTutors(data)
  }


  const [searchTerm, setSearchTerm] = React.useState<string>("");

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
    useTableColumn(tutors.data, columns, setColumns);

  const { filteredData: filteredTutors } = useSearchTableData(
    sortedTutors,
    searchTerm
  );

  const viewTutor = (tutor: Tutor) => {
    // setTutor(tutor);
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
      <div className="flex flex-1 flex-row justify-between items-center pb-4">
        <h1 className="text-xl font-bold">Tutor List</h1>
        <div className="flex flex-row items-center space-x-4">
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>
      </div>
      <DataTable
        data={filteredTutors}
        columns={columns}
        actions={[]}
        onRowClick={(tutor) => viewTutor(tutor)}
        onColumnClick={(column) => sortTutorByColumn(column, columns)}
        renderCell={renderTutorCell}
      />
    </div>
  );
}
