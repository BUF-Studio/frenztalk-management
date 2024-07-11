"use client";

import StudentList from "./studentList";
import SearchBar from "@/app/components/dashboard/SearchBar";
import { useState, useEffect } from "react";
import styles from "@/styles/main/students/Page.module.scss";
import StudentForm from "./studentForm";
import { useStudentPage } from "@/lib/context/page/studentPageContext";
import { Student } from "@/lib/models/student";
import { addStudent, updateStudent } from "@/lib/firebase/student";
import { DataTable } from "@/app/components/dashboard/DataTable";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { set } from "firebase/database";

const StudentPage = () => {
  const { students } = useStudents();
  const { student, setStudent } = useStudentPage();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const columns: { key: keyof Student; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "status", label: "Status" },
  ];

  useEffect(() => {
    console.log("searchKeyword", searchKeyword);
  }, [searchKeyword]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleAddStudent = () => {
    setShowAddForm(true);
  };

  function handleOnEdit(item: Student): void {
    setShowAddForm(true);
    setStudent(item);
  }

  const handleFormCancel = () => {
    setShowAddForm(false); // Hide the form when cancel button is clicked
    setStudent(null); // Reset the student state
  };

  const handleFormSubmit = async (formData: {
    name: string;
    age: number;
    status: string;
  }) => {
    try {
      if (student) {
        const updatedStudent = new Student(
          student.id,
          formData.name,
          formData.age,
          formData.status,
          student.subjectsId,
          student.tutorsId
        );
        await updateStudent(updatedStudent);
      } else {
        const newStudent = new Student(
          null,
          formData.name,
          formData.age,
          formData.status,
          [],
          []
        );
        await addStudent(newStudent);
      }
      setStudent(null);
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to add/update student", error);
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerContainer}>
        <SearchBar onSearch={handleSearch} />
        {!showAddForm && (
          <button
            type="submit"
            className={styles.addStudentButton}
            onClick={handleAddStudent}
          >
            Add Student
          </button>
        )}
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.studentList}>
          <DataTable
            data={students}
            columns={columns}
            onEdit={handleOnEdit}
            onDelete={() => console.log("Delete")}
          />
        </div>
        {showAddForm && (
          <div className={styles.studentForm}>
            <StudentForm
              student={student}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPage;
