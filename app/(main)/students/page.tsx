"use client";

import { DataTable } from "@/app/components/ui/data-table";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import type PaginatedResult from "@/lib/models/paginationResult";
import type Student from "@/lib/models/student";
import { useEffect, useState } from "react";
import { columns } from "./columns";

interface FetchStudentsParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: Record<string, string>;
}

export default function StudentList() {
  const [students, setStudents] = useState<PaginatedResult<Student>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { showSnackbar } = useSnackbar();

  
  useEffect(() => {
    const fetchStudents = async (params: FetchStudentsParams) => {
      try {
        const queryParams = new URLSearchParams({
          page: (params.page + 1).toString(),
          pageSize: params.pageSize.toString(),
          ...(params.sortField && { sortField: params.sortField }),
          ...(params.sortDirection && { sortDirection: params.sortDirection }),
          // ...params.filters,
        });
  
        const response = await fetch(`/api/students?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
        showSnackbar("Error fetching students", "error");
      }
    };
    fetchStudents({ page: pageIndex, pageSize, sortField, sortDirection, filters });
  }, [pageIndex, pageSize, sortField, sortDirection, filters, showSnackbar]);

  const handlePaginationChange = (newPageIndex: number, newPageSize: number) => {
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
        <h1 className="text-xl font-bold">Student List</h1>
        <div className="flex flex-row items-center space-x-4" />
      </div>
      <DataTable
        columns={columns}
        data={students.data}
        getRowHref={(student) => `/students/${student.id}`}
        onPaginationChange={handlePaginationChange}
        onSortChange={handleSortChange}
        onFilterChange={handleFilterChange}
        pageCount={Math.ceil(students.total / pageSize)}
        pageIndex={pageIndex}
        pageSize={pageSize}
        sortField={sortField}
        sortDirection={sortDirection}
        filters={filters}
      />
    </div>
  );
}