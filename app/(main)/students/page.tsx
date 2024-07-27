"use client";

import SearchBar from "@/app/components/dashboard/SearchBar";
import { useState, useEffect } from "react";
import styles from "@/styles/main/students/Page.module.scss";
import StudentForm from "./studentForm";
import { useStudentPage } from "@/lib/context/page/studentPageContext";
import { Student } from "@/lib/models/student";
import {
  addStudent,
  updateStudent,
  deleteStudent,
} from "@/lib/firebase/student";
import { type Action, DataTable } from "@/app/components/dashboard/DataTable";
import { useStudents } from "@/lib/context/collection/studentsContext";
import Badge from "@/app/components/dashboard/Badge";

const StudentPage = () => {
  const { students } = useStudents();
  const { student, setStudent } = useStudentPage();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [changedIds, setChangedIds] = useState<string[]>([]);

  const columns: { key: keyof Student; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "age", label: "Age" },
    { key: "status", label: "Status" },
  ];

  const renderStudentCell = (student: Student, columnKey: keyof Student) => {
    if (columnKey === "status") {
      return <Badge status={student.status as string} />;
    }
    return student[columnKey] as React.ReactNode;
  };

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

  function handleOnDelete(item: Student): void {
    setShowAddForm(false);
    deleteStudent(item);
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
      let changedId = "";
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
        changedId = student.id || "";
      } else {
        const newStudent = new Student(
          null,
          formData.name,
          formData.age,
          formData.status,
          [],
          []
        );
        changedId = await addStudent(newStudent);
      }
      setStudent(null);
      setShowAddForm(false);

      setChangedIds((prev) => [...prev, changedId]);
      setTimeout(() => {
        setChangedIds((prev) => prev.filter((id) => id !== changedId));
      }, 1000);
    } catch (error) {
      console.error("Failed to add/update student", error);
    }
  };

  const actions: Action<Student>[] = [
    {
      label: "Edit",
      onClick: handleOnEdit,
      color: "primary",
    },
    {
      label: "Delete",
      onClick: handleOnDelete,
      color: "error",
    },
  ];

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
            actions={actions}
            changedIds={changedIds}
            renderCell={renderStudentCell}
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
