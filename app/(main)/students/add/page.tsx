"use client";

import Link from "next/link";
import StudentForm from "../components/studentForm";
import { useStudentPage } from "@/lib/context/page/studentPageContext";
import { useRouter } from "next/navigation";

export default function AddStudent() {
  const { student, setStudent } = useStudentPage();

  const router = useRouter();
  setStudent(null);

  return (
    <div>
      <button
        onClick={(e) => {
          router.back();
        }}
      >
        Back
      </button>

      <h2>Add Student</h2>
      <StudentForm></StudentForm>
    </div>
  );
}
