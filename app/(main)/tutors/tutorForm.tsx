// pages/edit-tutor.tsx
"use client";

import { useTutorPage } from "@/lib/context/page/tutorPageContext";
import { addAvaSubject } from "@/lib/firebase/avaSubject";
import { addTutor } from "@/lib/firebase/tutor";
import { AvaSubject } from "@/lib/models/avaSubject";
import { Tutor } from "@/lib/models/tutor";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import styles from "@/styles/main/tutors/TutorForm.module.scss";

interface TutorFormProps {
  onSubmit: (formData: {
    name: string;
    description: string;
    subjects: string[];
    pic: string;
    freezeAccount: boolean;
  }) => Promise<void>;
  onCancel: () => void;
}

const TutorForm: React.FC<TutorFormProps> = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const [addSubject, setAddSubject] = useState<AvaSubject | null>(null);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectLevel, setNewSubjectLevel] = useState("");
  const [freezeAccount, setFreezeAccount] = useState(false);

  const { tutor, setTutor } = useTutorPage();
  const { avaSubjects } = useAvaSubjects();

  const router = useRouter();

  useEffect(() => {
    if (tutor) {
      setName(tutor.name);
      setDescription(tutor.des);
      setSubjects(tutor.subjects);
      setFreezeAccount(tutor.freeze);
    }
  }, [tutor]);

  const handleAddSubject = () => {
    if (addSubject) {
      setSubjects((prevSubjects) => [...prevSubjects, addSubject.id || ""]);
      setAddSubject(null);
    }
  };

  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    if (selectedId !== "") {
      const selected = avaSubjects.find((subject) => subject.id === selectedId);
      setAddSubject(selected || null);
    }
  };

  const handleAddNewSubject = async () => {
    const newSubject = new AvaSubject(null, newSubjectName, newSubjectLevel);
    const newSubjectId = await addAvaSubject(newSubject);
    if (newSubjectId) {
      setSubjects((prevSubjects) => [...prevSubjects, newSubjectId]);
      setNewSubjectName("");
      setNewSubjectLevel("");
    }
  };

  const handleRemoveSubject = (id: string) => {
    setSubjects((prevSubjects) => prevSubjects.filter((sub) => sub !== id));
  };

  const getSubjectName = (id: string): string => {
    const subject = avaSubjects.find((sub) => sub.id === id);
    return subject?.name || "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await onSubmit({
        name: name,
        description,
        subjects,
        pic: "",
        freezeAccount,
      });
    } catch (error) {
      console.error("Failed to submit the form", error);
    }
  };

  return (
    <div className={styles.tutorFormContainer}>
      <h2 className={styles.tutorFormHeader}>
        {tutor ? "Edit Tutor" : "Add Tutor"}
      </h2>
      <form className={styles.tutorForm}>
        <p className={styles.formSectionTitle}>Tutor Information</p>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <p className={styles.formSectionTitle}>Available Subjects</p>
          <>
            {subjects.map((sub) => (
              <div key={sub} className={styles.subjectContainer}>
                {getSubjectName(sub)}
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => handleRemoveSubject(sub)}
                >
                  ×
                </button>
              </div>
            ))}
          </>
        </div>
        <div className={styles.formGroup}>
          <label>Existing Subject</label>
          <div className={styles.addSubjectContainer}>
            <select
              value={addSubject?.id || ""}
              onChange={handleSubjectChange}
              className={styles.addSubjectDropDown}
            >
              <option value="">Select a subject</option>
              {avaSubjects
                .filter((subject) => !subjects.includes(subject.id || ""))
                .map((subject) => (
                  <option key={subject.id} value={subject.id || ""}>
                    {subject.name}
                  </option>
                ))}
            </select>
            <button
              type="button"
              onClick={handleAddSubject}
              className={styles.addSubjectButton}
            >
              Add
            </button>
          </div>
        </div>
        <div className={styles.formGroup}>
          <label>Add New Subject</label>
          <input
            type="text"
            placeholder="Name"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Level"
            value={newSubjectLevel}
            onChange={(e) => setNewSubjectLevel(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAddNewSubject}
            className={styles.addNewSubjectButton}
          >
            Add New Subject
          </button>
        </div>
        <hr />
        <div className={styles.formGroup}>
          <div className={styles.freezeAccountContainer}>
            <p>Freeze Account</p>
            <input
              type="checkbox"
              checked={freezeAccount}
              onChange={(e) => setFreezeAccount(e.target.checked)}
            />
          </div>
        </div>
        <div className={styles.spacer} />
      </form>
      <div className={styles.buttonsContainer}>
        <button
          type="button"
          onClick={onCancel}
          className={`${styles.formButton} ${styles.cancelButton}`}
        >
          Cancel
        </button>
        <button
          type="button"
          className={styles.formButton}
          onClick={handleSubmit}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default TutorForm;
