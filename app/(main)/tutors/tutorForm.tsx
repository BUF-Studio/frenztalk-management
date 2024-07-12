// pages/edit-tutor.tsx
"use client";

import { useAvaSubjects } from "@/lib/context/collection/avaSubjectContext";
import { useTutorPage } from "@/lib/context/page/tutorPageContext";
import { addAvaSubject } from "@/lib/firebase/avaSubject";
import { addTutor } from "@/lib/firebase/tutor";
import { AvaSubject } from "@/lib/models/avaSubject";
import { Tutor } from "@/lib/models/tutor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "@/styles/main/tutors/TutorForm.module.scss";

interface TutorFormProps {
  onSubmit: (formData: {
    name: string;
    description: string;
    subject: string[];
    freezeAccount: boolean;
  }) => Promise<void>;
  onCancel: () => void;
}

const TutorForm = () => {
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

  const handleConfirm = async () => {
    try {
      if (tutor) {
        const updatedTutor = new Tutor(
          tutor.id,
          name,
          subjects,
          description,
          "pic",
          freezeAccount
        );
        await setTutor(updatedTutor);
      } else {
        const newTutor = new Tutor(
          null,
          name,
          subjects,
          description,
          "pic",
          freezeAccount
        );
        await addTutor(newTutor);
      }
      setTutor(null);
      router.push("/tutors");
    } catch (error) {
      console.error("Failed to add/update tutor", error);
    }
  };

  const handleCancel = () => {
    setTutor(null);
    router.push("/tutors");
  };

  const getSubjectName = (id: string): string => {
    const subject = avaSubjects.find((sub) => sub.id === id);
    return subject?.name || "";
  };

  return (
    <div className={styles.tutorFormContainer}>
      <h2 className={styles.tutorFormHeader}>
        {tutor ? "Edit Tutor" : "Add Tutor"}
      </h2>
      <p className={styles.formSectionTitle}>Tutor Information</p>
      <form className={styles.tutorForm}>
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
          <label>Subjects</label>
          <ul>
            {subjects.map((sub) => (
              <li key={sub}>{getSubjectName(sub)}</li>
            ))}
          </ul>
        </div>
        <div className={styles.formGroup}>
          <label>Add Existing Subject</label>
          <select value={addSubject?.id || ""} onChange={handleSubjectChange}>
            <option value="">Select a subject</option>
            {avaSubjects
              .filter((subject) => !subjects.includes(subject.id || ""))
              .map((subject) => (
                <option key={subject.id} value={subject.id || ""}>
                  {subject.name}
                </option>
              ))}
          </select>
          <button type="button" onClick={handleAddSubject}>
            Add Subject
          </button>
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
          <button type="button" onClick={handleAddNewSubject}>
            Add New Subject
          </button>
        </div>
        <div className={styles.formGroup}>
          <label>Freeze Account</label>
          <input
            type="checkbox"
            checked={freezeAccount}
            onChange={(e) => setFreezeAccount(e.target.checked)}
          />
        </div>
        <div className={styles.spacer} />
        <div className={styles.buttonsContainer}>
          <button
            type="button"
            onClick={handleCancel}
            className={`${styles.formButton} ${styles.cancelButton}`}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={styles.formButton}
          >
            Confirm
          </button>
        </div>
      </form>
    </div>
  );
};

export default TutorForm;
