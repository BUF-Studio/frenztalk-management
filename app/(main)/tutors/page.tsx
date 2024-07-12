"use client";

import TutorList from "./tutorList";
import SearchBar from "@/app/components/dashboard/SearchBar";
import { useState, useEffect } from "react";
import styles from "@/styles/main/tutors/Page.module.scss";
import type { Tutor } from "@/lib/models/tutor";
import { addTutor, setTutor as updateTutor } from "@/lib/firebase/tutor";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useTutorPage } from "@/lib/context/page/tutorPageContext";
import { DataTable } from "@/app/components/dashboard/DataTable";
import TutorForm from "./tutorForm";

const TutorPage = () => {
  const { tutors } = useTutors();
  const { tutor, setTutor } = useTutorPage();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [changedIds, setChangedIds] = useState<string[]>([]);

  const columns: { key: keyof Tutor; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "des", label: "Description" },
    { key: "pic", label: "Picture" },
    { key: "subjects", label: "Subjects" },
  ];

  useEffect(() => {
    console.log("searchKeyword", searchKeyword);
  }, [searchKeyword]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleAddStudent = () => {
    setShowForm(true);
  };

  function handleOnEdit(item: Tutor): void {
    setShowForm(true);
    setTutor(item);
  }

  function handleOnDelete(item: Tutor): void {
    setShowForm(false);
  }

  const handleFormCancel = () => {
    setShowForm(false); // Hide the form when cancel button is clicked
    setTutor(null); // Reset the student state
  };


  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerContainer}>
        <SearchBar onSearch={handleSearch} />
        {!showForm && (
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
            data={tutors}
            columns={columns}
            onEdit={handleOnEdit}
            onDelete={handleOnDelete}
            changedIds={changedIds}
          />
        </div>
        {showForm && (
          <div className={styles.studentForm}>
            <TutorForm
              
            />
            {/* <StudentForm
              student={student}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorPage;
