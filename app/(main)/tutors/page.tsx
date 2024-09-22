"use client";

import type { Tutor } from "@/lib/models/tutor";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { DataTable } from "@/app/components/ui/data-table";
import { columns } from "./columns";
import { useTutors } from "@/lib/context/collection/tutorContext";

interface FetchTutorsParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: Record<string, string>;
}


export default function TutorList() {
  // const [tutors, setTutors] = useState<PaginatedResult<Tutor>>({
  //   data: [],
  //   total: 0,
  //   page: 1,
  //   pageSize: 10,
  // });
  const {tutors} = useTutors()
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { showSnackbar } = useSnackbar();

  // useEffect(() => {
  //   async function fetchTutors(params: FetchTutorsParams) {
  //     try {
  //       const queryParams = new URLSearchParams({
  //         page: (params.page + 1).toString(),
  //         pageSize: params.pageSize.toString(),
  //         ...(params.sortField && { sortField: params.sortField }),
  //         ...(params.sortDirection && { sortDirection: params.sortDirection }),
  //         // ...params.filters,
  //       });

  //       const response = await fetch(
  //         `/api/tutors?${queryParams.toString()}`
  //       );
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch students');
  //       }
  //       const data = await response.json();
  //       setTutors(data);
  //     } catch (error) {
  //       showSnackbar("Error fetching Tutors", "error");
  //     }
  //   }
  //   fetchTutors({ page: pageIndex, pageSize, sortField, sortDirection, filters });
  // }, [filters, pageIndex, pageSize, showSnackbar, sortDirection, sortField]);

  const handlePaginationChange = (
    newPageIndex: number,
    newPageSize: number
  ) => {
    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
  };

  const handleSortChange = (field: string, direction: 'asc' | 'desc') => {
    setSortField(field);
    setSortDirection(direction);
    setPageIndex(0); // Reset to first page when filters change
  };

  const handleFilterChange = (columnId: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnId]: value,
    }));
    setPageIndex(0); // Reset to first page when filters change
  };

  return (
    <div>
      <div className="flex flex-1 flex-row justify-between items-center pb-4">
        <h1 className="text-xl font-bold">Tutor List</h1>
        <div className="flex flex-row items-center space-x-4"/>
      </div>
      <DataTable
        columns={columns}
        data={tutors}
        getRowHref={(tutor) => `/tutors/${tutor.id}`}
        onPaginationChange={handlePaginationChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        pageCount={Math.ceil(tutors.length / pageSize)}
        pageIndex={pageIndex}
        pageSize={pageSize}
        filters={filters}
      />
    </div>
  );
}
