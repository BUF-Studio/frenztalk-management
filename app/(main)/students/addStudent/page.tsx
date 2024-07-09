"use client";

import { useStudentPage } from "@/lib/context/page/studentPageContext";
import { addStudent, updateStudent } from "@/lib/firebase/student";
import { Student } from "@/lib/models/student";
import StudentForm from "../studentForm";
import { useRouter } from "next/router";

interface AddStudentPageProps {
  onCancel: () => void;
}

const AddStudentPage:React.FC<AddStudentPageProps> = ({onCancel}) => {
  const { student, setStudent } = useStudentPage();
  const router = useRouter();

  const handleFormSubmit = async (formData: { name: string; age: number }) => {
    try {
      if (student) {
        const updatedStudent = new Student(
          student.id,
          formData.name,
          formData.age,
          "Active",
          student.subjectsId,
          student.tutorsId
        );
        await updateStudent(updatedStudent);
      } else {
        const newStudent = new Student(null, formData.name, formData.age, "Active", [], []);
        await addStudent(newStudent);
      }
      setStudent(null);
      router.push("/students");
    } catch (error) {
      console.error("Failed to add/update student", error);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div>
      <h1>Add Student</h1>
      <StudentForm onSubmit={handleFormSubmit} student={student} onCancel={handleCancel} />
    </div>
  );
};

export default AddStudentPage;
