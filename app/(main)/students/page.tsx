"use client";

import { DataTable } from "@/app/components/ui/data-table";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { useEffect, useState } from "react";
import { columns } from "./columns";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useStudentPage } from "@/lib/context/page/studentPageContext";
import { useRouter } from "next/navigation";

export default function StudentList() {
  const router = useRouter();
  const { setStudent } = useStudentPage();
  const { students } = useStudents();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<
    "asc" | "desc" | undefined
  >();
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { showSnackbar } = useSnackbar();

  const handlePaginationChange = (
    newPageIndex: number,
    newPageSize: number
  ) => {
    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
  };

  const handleSortChange = (field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortDirection(direction);
    setPageIndex(0); // Reset to first page when filters change
  };

  const handleFilterChange = (columnId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
    setPageIndex(0); // Reset to first page when filters change
  };

  return (
    <div>
      <div className="flex flex-1 flex-row w-full justify-between items-center pb-4">
        <h1 className="text-xl font-bold">Student List</h1>
        <div className="flex flex-row items-center space-x-4">
          <Link href="/students/add" prefetch={true}>
            <Button variant={"default"}>Add Account</Button>
          </Link>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={students}
        getRowHref={(student) => {
          router.push(`/students/${student.id}`);
          setStudent(student);
        }}
      />
    </div>
  );
}
