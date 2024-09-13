"use client";

import type { Tutor } from "@/lib/models/tutor";
import React, { useEffect, useState } from "react";
import type PaginatedResult from "@/lib/models/paginationResult";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { DataTable } from "@/app/components/ui/data-table";
import { columns } from "./columns";

export default function TutorList() {
  const [tutors, setTutors] = useState<PaginatedResult<Tutor>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    async function fetchTutors(page: number, pageSize: number) {
      try {
        const response = await fetch(
          `/api/tutors?page=${page}&pageSize=${pageSize}`
        );
        const data = await response.json();
        setTutors(data);
      } catch (error) {
        showSnackbar("Error fetching Tutors", "error");
      }
    }
    fetchTutors(pageIndex + 1, pageSize);
  }, [pageIndex, pageSize, showSnackbar]);

  const handlePaginationChange = (
    newPageIndex: number,
    newPageSize: number
  ) => {
    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
  };

  return (
    <div>
      <div className="flex flex-1 flex-row justify-between items-center pb-4">
        <h1 className="text-xl font-bold">Tutor List</h1>
        <div className="flex flex-row items-center space-x-4"/>
      </div>
      <DataTable
        columns={columns}
        data={tutors.data}
        getRowHref={(tutor) => `/tutors/${tutor.id}`}
        onPaginationChange={handlePaginationChange}
        pageCount={Math.ceil(tutors.total / pageSize)}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />
    </div>
  );
}
