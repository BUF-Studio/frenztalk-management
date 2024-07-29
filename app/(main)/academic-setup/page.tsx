"use client";

import { educationLevelStream } from "@/lib/firebase/educationLevel";
import { pricingStream } from "@/lib/firebase/pricing";
import {
  addSubject,
  deleteSubject,
  subjectsStream,
  updateSubject,
} from "@/lib/firebase/subject";
import type { EducationLevel } from "@/lib/models/educationLevel";
import type { Pricing } from "@/lib/models/pricing";
import { Subject } from "@/lib/models/subject";
import styles from "@/styles/main/subjects/Page.module.scss";
import { useEffect, useState } from "react";
import { CircleMinus, CheckCircle2, XCircle, Pencil } from "lucide-react";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { getErrorMessage } from "@/utils/get-error-message";

type ItemType = Subject | EducationLevel | Pricing;

const SubjectPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>([]);
  const [pricing, setPricing] = useState<Pricing[]>([]);
  const [newSubjectName, setNewSubjectName] = useState<string>("");
  const [addingSubject, setAddingSubject] = useState<boolean>(false);
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [subjectEdits, setSubjectEdits] = useState<{
    [key: string]: string;
  }>({});

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    // Set up the real-time listener for users
    const unsubscribeEducationLevels = educationLevelStream(
      (updatedEducationLevels) => {
        setEducationLevels(updatedEducationLevels);
      }
    );

    const unsubscribeSubjects = subjectsStream((updatedSubjects) => {
      setSubjects(updatedSubjects);
    });

    const unsubscribePricing = pricingStream((updatedPricing) => {
      setPricing(updatedPricing);
    });

    // Cleanup function to unsubscribe when component unmounts
    return () => {
      unsubscribeEducationLevels();
      unsubscribeSubjects();
      unsubscribePricing();
    };
  }, []);

  function updateItem(
    collectionName: string,
    id: string | null,
    arg2: string,
    value: string
  ): void {
    throw new Error("Function not implemented.");
  }

  function deleteItem(collectionName: string, id: string | null): void {
    throw new Error("Function not implemented.");
  }

  const addItem = () => {
    try {
      if (!newSubjectName) {
        showSnackbar("Subject name cannot be empty", "error");
        return;
      }
      const newSubject = new Subject(null, newSubjectName);
      addSubject(newSubject);
      setNewSubjectName("");
      setAddingSubject(false);
    } catch (error) {
      showSnackbar(getErrorMessage(error), "error");
    }
  };

  const handleAddSubject = () => {
    setAddingSubject(true);
  };

  const handleCancelAddSubject = () => {
    setNewSubjectName("");
    setAddingSubject(false);
  };

  const handleEditSubject = (id: string) => {
    console.log("Editing subject", id);
    setEditingSubjectId(id);
    setSubjectEdits((prev) => ({
      ...prev,
      [id]: subjects.find((subject) => subject.id === id)?.name || "",
    }));
  };

  const handleCancelEditSubject = () => {
    setEditingSubjectId(null);
  };

  const handleConfirmEditSubject = (id: string) => {
    try {
      const updatedSubject = new Subject(id, subjectEdits[id]);
      updateSubject(updatedSubject);
      showSnackbar("Subject updated successfully", "success");
      setEditingSubjectId(null);
    } catch (error) {
      showSnackbar(getErrorMessage(error), "error");
    }
  };

  const renderSection = <T extends ItemType>(
    title: string,
    items: T[],
    collectionName: string,
    onAdd: (item: T) => void,
    onDelete: (item: T) => void,
    onUpdate: (item: T) => void
  ) => (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>{title}</h2>
        <p>Manage your {title.toLowerCase()} here</p>
      </div>
      <div className={styles.cardContent}>
        {items.length === 0 && (
          <p className={styles.emptyMessage}>
            No {title.toLowerCase()} available. Click the button below to add
            one.
          </p>
        )}
        {items.map((item) => (
          <div key={item.id} className={styles.inputGroup}>
            <input
              type="text"
              placeholder={`${title} name`}
              value={
                editingSubjectId === item.id
                  ? subjectEdits[item.id || ""]
                  : item.name
              }
              onChange={(e) => {
                setSubjectEdits((prev) => ({
                  ...prev,
                  [item.id ? item.id : ""]: e.target.value,
                }));
              }}
              disabled={editingSubjectId !== item.id}
            />
            {editingSubjectId === item.id ? (
              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={handleCancelEditSubject}
                  className={[styles.btn, styles.btnDelete].join(" ")}
                >
                  <XCircle className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleConfirmEditSubject(item.id ? item.id : "")
                  }
                  className={[styles.btn, styles.btnSave].join(" ")}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={() => handleEditSubject(item.id ? item.id : "")}
                  className={[styles.btnNormal, styles.btn].join(" ")}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item)}
                  className={[styles.btnNormal, styles.btn].join(" ")}
                >
                  <CircleMinus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
        {/* Add new subject */}
        {addingSubject && (
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="New Subject Name"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
            />
            <div className={styles.buttonGroup}>
              <button
                type="button"
                onClick={addItem}
                className={[styles.btn, styles.btnSave].join(" ")}
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleCancelAddSubject}
                className={[styles.btn, styles.btnDelete].join(" ")}
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      <div className={styles.cardFooter}>
        <button
          type="button"
          onClick={handleAddSubject}
          className={[styles.btnAdd, styles.btn].join(" ")}
        >
          Add {title}
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentContainer}>
        <div className={styles.subcontentContainer}>
          {/* {renderSection<Subject>(
            "Subjects",
            subjects,
            "subjects",
            addSubject,
            deleteSubject,
            updateSubject
          )} */}
        </div>
        <div className={styles.subcontentContainer}>
          {/* {renderSection<EducationLevel>(
            "Education Levels",
            educationLevels,
            "educationLevels"
          )}
          {renderSection<Pricing>("Pricing", pricing, "pricing")} */}
        </div>
      </div>
    </div>
  );
};

export default SubjectPage;
