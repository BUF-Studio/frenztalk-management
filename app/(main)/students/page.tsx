"use client";

import { DataTable } from "@/app/components/ui/data-table";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import type PaginatedResult from "@/lib/models/paginationResult";
import type Student from "@/lib/models/student";
import { useEffect, useState } from "react";
import { columns } from "./columns";

export default function StudentList() {
  const [students, setStudents] = useState<PaginatedResult<Student>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    async function fetchStudents(page: number, pageSize: number) {
      try {
        const response = await fetch(
          `/api/students?page=${page}&pageSize=${pageSize}`
        );
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        showSnackbar("Error fetching students", "error");
      }
    }
    fetchStudents(pageIndex + 1, pageSize);
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
        <h1 className="text-xl font-bold">Student List</h1>
        <div className="flex flex-row items-center space-x-4" />
      </div>
      <DataTable
        columns={columns}
        data={students.data}
        getRowHref={(student) => `/students/${student.id}`}
        onPaginationChange={handlePaginationChange}
        pageCount={Math.ceil(students.total / pageSize)}
        pageIndex={pageIndex}
        pageSize={pageSize}
      />
    </div>
  );
}
