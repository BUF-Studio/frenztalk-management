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
import { Badge, type BadgeProps } from "@/app/components/ui/badge";
import StudentDialog from "./studentForm";
import { capitalizeFirstLetter } from "@/utils/util";

export default function StudentList() {
  const { students } = useStudents();
  const router = useRouter();
  const { setStudent } = useStudentPage();
  const { showSnackbar } = useSnackbar();

  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const columns: { key: keyof Student; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "status", label: "Status" },
  ];

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
      <div className="flex flex-1 flex-row justify-between pb-4">
        <h1 className="text-xl font-bold">Student List</h1>
        <button
          className="flex flex-row items-center px-4 py-2  bg-red-800 text-white text-sm rounded-md font-semibold hover:bg-red-800/[0.8] hover:shadow-lg"
          type="button"
          onClick={toggleDialog}
        >
          <Plus size={16} strokeWidth={3} className="mr-1" />
          Add Student
        </button>
      </div>
      <DataTable
        data={students}
        columns={columns}
        actions={[]}
        onRowClick={(student) => viewStudent(student)}
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
