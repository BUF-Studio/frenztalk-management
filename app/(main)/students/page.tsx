"use client";

import StudentList from "./studentList";
import SearchBar from "@/app/components/dashboard/SearchBar";
import { useState, useEffect } from "react";
import styles from "@/styles/main/students/Page.module.scss";
import StudentForm from "./studentForm";
import { useStudentPage } from "@/lib/context/page/studentPageContext";
import { Student } from "@/lib/models/student";
import { addStudent, updateStudent } from "@/lib/firebase/student";

const StudentPage = () => {
  const { student, setStudent } = useStudentPage();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false); // State to manage form visibility

  useEffect(() => {
    console.log("searchKeyword", searchKeyword);
  }, [searchKeyword]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleAddStudent = () => {
    setShowAddForm(true);
  };

  const handleFormCancel = () => {
    setShowAddForm(false); // Hide the form when cancel button is clicked
  };

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
        const newStudent = new Student(
          null,
          formData.name,
          formData.age,
          "Active",
          [],
          []
        );
        await addStudent(newStudent);
      }
      setStudent(null);
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
          <StudentList />
        </div>
        {showAddForm && (
          <div className={styles.studentForm}>
            <StudentForm
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
