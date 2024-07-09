import { useStudents } from "@/lib/context/collection/studentsContext";
import { useStudentPage } from "@/lib/context/page/studentPageContext";
import type { Student } from "@/lib/models/student";
import { useRouter } from "next/navigation";
import { DataTable } from "@/app/components/dashboard/DataTable";
import type React from "react";

const StudentList: React.FC = () => {
  const { students } = useStudents();
  const { setStudent } = useStudentPage();

  const columns: { key: keyof Student; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
  ];
  const router = useRouter();

  const navi = (student: Student) => {
    console.log("setstudent");
    console.log(student);
    setStudent(student);
    router.push("/students/editStudent");
  };

  return (
    <DataTable
      data={students}
      columns={columns}
      onEdit={() => {}}
      onDelete={() => {}}
    />
  );
};

export default StudentList;
