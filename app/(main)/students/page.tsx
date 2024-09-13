"use client";

import { DataTable } from "@/app/components/ui/data-table";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { TableOrderEnum } from "@/lib/enums/TableOrderEnum";
import type PaginatedResult from "@/lib/models/paginationResult";
import type Student from "@/lib/models/student";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { columns } from "./columns";

export default function StudentList() {
  const [students, setStudents] = useState<PaginatedResult<Student>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents(page = 1, pageSize = 10) {
    const response = await fetch(
      `/api/students?page=${page}&pageSize=${pageSize}`
    );
    const data = await response.json();
    console.log(data);
    setStudents(data);
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
        status: studentData.status ?? "active",
      };

      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudent),
      });
      if (response.ok) {
        showSnackbar("Successfully added student", "success");
        toggleDialog();
        fetchStudents();
      }
    } catch (error) {
      showSnackbar("Error processing student", "error");
    }
  };

  const initialColumns: { key: keyof Student; label: string; order: string }[] =
    [
      { key: "id", label: "ID", order: TableOrderEnum.NONE },
      { key: "name", label: "Name", order: TableOrderEnum.NONE },
      { key: "age", label: "Age", order: TableOrderEnum.NONE },
      { key: "status", label: "Status", order: TableOrderEnum.NONE },
    ];

  const viewStudent = (student: Student) => {
    // setStudent(student);
    router.push(`/students/${student.id}`);
  };

  return (
    <div>
      <div className="flex flex-1 flex-row justify-between items-center pb-4">
        <h1 className="text-xl font-bold">Student List</h1>
        <div className="flex flex-row items-center space-x-4" />
      </div>
      <DataTable columns={columns} data={students.data} getRowHref={(student) => `/students/${student.id}`}/>
    </div>
  );
}
