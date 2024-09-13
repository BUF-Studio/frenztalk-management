"use client";

import { DataTable } from "@/app/components/ui/data-table";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import type PaginatedResult from "@/lib/models/paginationResult";
import type Student from "@/lib/models/student";
import { useEffect, useState } from "react";
import { columns } from "./columns";

interface FetchStudentsParams {
  // id?: string;
  tutorId?: string;
  page?: number;
  pageSize?: number;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  // searchField?: string;
  searchTerm?: string;
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
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    // Initial fetch
    fetchStudents({ page: pageIndex + 1, pageSize: pageSize })
  }, [pageIndex, pageSize])

  const handlePageChange = (newPage: number) => {
    fetchStudents({ page: newPage, pageSize: pageSize, })
  }

  const handleFilterChange = (filters: Partial<FetchStudentsParams>) => {
    fetchStudents({ page: 1, pageSize: 10, ...filters })
  }
  // example filter
  // <button onClick={() => handleFilterChange({ tutorId: 'some-tutor-id' })}>
  //         Filter by Tutor
  //       </button>
  //       <button onClick={() => handleFilterChange({ grade: '10' })}>
  //         Filter by Grade 10
  //       </button>
  //       <button onClick={() => handleFilterChange({ 
  //         searchField: 'skills', 
  //         searchTerm: 'math' 
  //       })}></button>

  async function fetchStudents(
    params: FetchStudentsParams

  ) {
    const queryParams = new URLSearchParams()

    // Add all provided parameters to the query string
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString())
      }
    })


    try {
      const response = await fetch(`/api/students?${queryParams.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to fetch students')
      }
      const data = await response.json()
      setStudents(data)
    } catch (err) {
      // setError('An error occurred while fetching students')
      console.error(err)
    } finally {
      // setIsLoading(false)
    }
  }

  function getStatusVariant(status: string): BadgeProps["variant"] {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "frozen":
        return "error";
      default:
        return "info";
    }
  }

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };



  const handleAddStudent = async (studentData: Partial<Student>) => {
    try {
      const newStudent: Student = {
        id: null,
        name: studentData.name ?? "",
        age: studentData.age ?? 0,
        status: studentData.status ?? "active"
      }

      const response = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStudent)
      })
      if (response.ok) {
        showSnackbar("Successfully added student", "success");
        toggleDialog();
        fetchStudents({ page: 1, pageSize: 10 })
      }

    } catch (error) {
      showSnackbar("Error processing student", "error");
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
