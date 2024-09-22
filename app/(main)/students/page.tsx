"use client";

import { DataTable } from "@/app/components/ui/data-table";
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

  return (
    <div>
      <div className="flex flex-1 flex-row w-full justify-between items-center pb-4">
        <h1 className="text-xl font-bold">Student List</h1>
        <div className="flex flex-row items-center space-x-4">
          <Link href="/students/add" prefetch={true}>
            <Button variant={"default"}>Add Student</Button>
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
