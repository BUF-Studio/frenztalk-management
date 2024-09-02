"use client";

import { DataTable } from "@/app/components/dashboard/DataTable";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useStudentPage } from "@/lib/context/page/studentPageContext";
import { addStudent, updateStudent } from "@/lib/firebase/student";
import { Student } from "@/lib/models/student";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { Badge, type BadgeProps } from "@/app/components/general/badge";
import StudentDialog from "./studentForm";
import { capitalizeFirstLetter } from "@/utils/util";
import { useTableColumn } from "@/lib/general_hooks/useTableColumn";
import { TableOrderEnum } from "@/lib/enums/TableOrderEnum";
import { useSearchTableData } from "@/lib/general_hooks/useSearchTableData";
import { SearchBar } from "@/app/components/general/input/searchBar";

export default function StudentList() {
  const { students } = useStudents();
  const router = useRouter();
  const { setStudent } = useStudentPage();
  const { showSnackbar } = useSnackbar();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

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
      const newStudent = new Student(
        null,
        studentData.name ?? "",
        studentData.age ?? 0,
        studentData.status ?? "active"
      );
      await addStudent(newStudent);
      showSnackbar("Successfully added student", "success");
      toggleDialog();
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

  const [columns, setColumns] = useState(initialColumns);

  const { sortedData: sortedStudents, sortColumn: sortStudentByColumns } =
    useTableColumn(students, columns, setColumns);

  const { filteredData: filteredStudents } = useSearchTableData(
    sortedStudents,
    searchTerm
  );

  const renderStudentCell = (student: Student, columnKey: keyof Student) => {
    if (columnKey === "status") {
      return (
        <Badge variant={getStatusVariant(student.status)}>
          {capitalizeFirstLetter(student.status as string)}
        </Badge>
      );
    }
    return student[columnKey] as React.ReactNode;
  };

  const viewStudent = (student: Student) => {
    setStudent(student);
    router.push(`/students/${student.id}`);
  };

  return (
    <div>
      <div className="flex flex-1 flex-row justify-between items-center pb-4">
        <h1 className="text-xl font-bold">Student List</h1>
        <div className="flex flex-row items-center space-x-4">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            label="search student"
          />

          <button
            className="flex flex-row items-center w-full px-4 py-2  bg-red-800 text-white text-sm rounded-md font-semibold hover:bg-red-800/[0.8] hover:shadow-lg"
            type="button"
            onClick={toggleDialog}
          >
            <Plus size={16} strokeWidth={3} className="mr-1" />
            Add Student
          </button>
        </div>
      </div>
      <DataTable
        data={filteredStudents}
        columns={columns}
        actions={[]}
        onRowClick={(student) => viewStudent(student)}
        onColumnClick={(column) => sortStudentByColumns(column, columns)}
        renderCell={renderStudentCell}
      />
      <StudentDialog
        isOpen={isDialogOpen}
        onClose={toggleDialog}
        onSubmit={handleAddStudent}
      />
    </div>
  );
}
