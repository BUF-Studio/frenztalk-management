"use client";

import SearchBar from "@/app/components/dashboard/SearchBar";
import { useState, useEffect } from "react";
import styles from "@/styles/main/tutors/Page.module.scss";
import { Tutor } from "@/lib/models/tutor";
import { addTutor, updateTutor } from "@/lib/firebase/tutor";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useTutorPage } from "@/lib/context/page/tutorPageContext";
import { type Action, DataTable } from "@/app/components/dashboard/DataTable";
import TutorForm from "./tutorForm";
import Image from "next/image";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";

const TutorPage = () => {
  const { tutors } = useTutors();
  const { tutor, setTutor } = useTutorPage();
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [changedIds, setChangedIds] = useState<string[]>([]);
  const { showSnackbar } = useSnackbar();

  const columns: { key: keyof Tutor; label: string }[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "subjects", label: "Subjects" },
    { key: "des", label: "Description" },
  ];

  const renderTutorCell = (tutor: Tutor, columnKey: keyof Tutor) => {
    if (columnKey === "name") {
      return (
        <div className={styles.tutorSection}>
          {tutor.pic ? (
            <Image
              src="/frenztalk-logo.jpg"
              alt="Frenztalk Logo"
              priority
              width={20}
              height={20}
            />
          ) : (
            <div className={styles.tutorPic} />
          )}
          <div>{tutor.name}</div>
        </div>
      );
    }

    return tutor[columnKey] as React.ReactNode;
  };

  useEffect(() => {
    console.log("searchKeyword", searchKeyword);
  }, [searchKeyword]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handleAddTutor = () => {
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false); // Hide the form when cancel button is clicked
    setTutor(null); // Reset the tutor state
  };

  const handleFormSubmit = async (formData: {
    name: string;
    description: string;
    subjects: string[];
    pic: string;
    freezeAccount: boolean;
    status: string;
  }) => {
    try {
      const newTutor = new Tutor(
        null,
        formData.name,
        formData.subjects,
        formData.description,
        formData.pic,
        formData.status
      );
      //TODO: change to updateTutor to set the tutor id manually with user id
      const changedId = await addTutor(newTutor);
      setShowForm(false);
      setTutor(null);

      setChangedIds((prev) => [...prev, changedId]);
      setTimeout(() => {
        setChangedIds((prev) => prev.filter((id) => id !== changedId));
      }, 1000);
    } catch (error) {
      console.error("Failed to submit the form", error);
    }
  };

  function handleOnDelete(item: Tutor): void {
    showSnackbar("Tutor deleted successfully", "success");
  }

  const actions: Action<Tutor>[] = [];

  return (
    <div className={styles.mainContainer}>
      <div className={styles.headerContainer}>
        <SearchBar onSearch={handleSearch} />
        {!showForm && (
          <button
            type="submit"
            className={styles.addTutorButton}
            onClick={handleAddTutor}
          >
            Add Tutor
          </button>
        )}
      </div>
      <div className={styles.contentContainer}>
        <div
          className={`${styles.tutorList} ${!showForm ? styles.fullWidth : ""}`}
        >
          <DataTable
            data={tutors}
            columns={columns}
            actions={actions}
            changedIds={changedIds}
            renderCell={renderTutorCell}
          />
        </div>
        {showForm && (
          <div className={styles.tutorForms}>
            <TutorForm
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorPage;
