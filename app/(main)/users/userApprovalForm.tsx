"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { type User, UserRole } from "@/lib/models/user";
import styles from "@/styles/main/users/UserApprovalForm.module.scss";
import type { Subject } from "@/lib/models/subject";
import type { EducationLevel } from "@/lib/models/educationLevel";
import { subjectsStream } from "@/lib/firebase/subject";
import { educationLevelStream } from "@/lib/firebase/educationLevel";

interface UserApprovalFormProps {
  onSubmit: (formData: {
    role: UserRole;
    description?: string;
  }) => Promise<void>;
  user?: User | null;
  onCancel: () => void;
}

const UserApprovalForm: React.FC<UserApprovalFormProps> = ({
  onSubmit,
  user,
  onCancel,
}) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [educationLevels, setEducationLevels] = useState<EducationLevel[]>([]);
  const [role, setRole] = useState<UserRole>(UserRole.NON_VERIFIED);
  const [description, setDescription] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectLevel, setNewSubjectLevel] = useState("");

  useEffect(() => {
    const unsubscribeSubjects = subjectsStream((updatedSubjects) => {
      setSubjects(updatedSubjects);
    });

    const unsubscribeEducationLevels = educationLevelStream(
      (updatedEducationLevels) => {
        setEducationLevels(updatedEducationLevels);
      }
    );

    return () => {
      unsubscribeSubjects();
      unsubscribeEducationLevels();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await onSubmit({ role, description });
    } catch (error) {
      console.error("Failed to submit the form", error);
    }
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value as UserRole;
    setRole(newRole);
  };

  const getSubjectName = (id: string): string => {
    const subject = subjects.find((sub) => sub.id === id);
    return subject?.name || "";
  };

  const handleRemoveSubject = (id: string) => {
    setSelectedSubjects((prevSubjects) =>
      prevSubjects.filter((sub) => sub !== id)
    );
  };

  const handleAddNewSubject = async () => {
    const newSubject = new AvaSubject(null, newSubjectName, newSubjectLevel);
    const newSubjectId = await addAvaSubject(newSubject);
    if (newSubjectId) {
      setSelectedSubjects((prevSubjects) => [...prevSubjects, newSubjectId]);
      setNewSubjectName("");
      setNewSubjectLevel("");
    }
  };

  const handleAddSubject = () => {
    if (addSubject) {
      setSelectedSubjects((prevSubjects) => [
        ...prevSubjects,
        addSubject.id || "",
      ]);
      setAddSubject(null);
    }
  };

  const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    if (selectedId !== "") {
      const selected = subjects.find((subject) => subject.id === selectedId);
      setAddSubject(selected || null);
    }
  };

  return (
    <div className={styles.userApprovalFormContainer}>
      <h2 className={styles.userApprovalFormHeader}>User Approval</h2>
      <form onSubmit={handleSubmit} className={styles.userApprovalForm}>
        <p className={styles.formSectionTitle}>Request Information</p>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input type="text" value={user?.name} disabled />
        </div>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input type="text" value={user?.email} disabled />
        </div>
        <div className={styles.formGroup}>
          <label>Status</label>
          <select value={role} onChange={handleRoleChange}>
            <option value={UserRole.NON_VERIFIED} disabled>
              Choose a role
            </option>
            <option value={UserRole.TUTOR}>Tutor</option>
            <option value={UserRole.ADMIN}>Admin</option>
          </select>
        </div>
        {role === UserRole.TUTOR && (
          <>
            <div className={styles.formGroup}>
              <label>Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <p className={styles.formSectionTitle}>Available Subjects</p>
              <>
                {selectedSubjects.map((sub) => (
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
              <div className={styles.addSubjectContainer}>
                <div className={styles.chooseSubjectContainer}>
                  <label>Subject</label>
                  <select
                    // value={addSubject?.id || ""}
                    onChange={handleSubjectChange}
                    className={styles.addSubjectDropDown}
                  >
                    <option value="" disabled>
                      Select a subject
                    </option>
                    {subjects
                      .filter(
                        (subject) =>
                          !selectedSubjects.includes(subject.id || "")
                      )
                      .map((subject) => (
                        <option key={subject.id} value={subject.id || ""}>
                          {subject.name}
                        </option>
                      ))}
                  </select>
                </div>
                {/* Education level */}
                <div className={styles.chooseSubjectContainer}>
                  <label>Level</label>
                  <select
                    value={"IGCSE-Secondary"}
                    onChange={handleSubjectChange}
                    className={styles.addSubjectDropDown}
                  >
                    <option value="" disabled>
                      Select a Level
                    </option>
                    {educationLevels.map((syllabus) => (
                      <optgroup key={syllabus.id} label={syllabus.name}>
                        {syllabus.levels.map((level, index) => (
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                          <option key={index} value={`${syllabus.name}-${level}`}>
                            {level}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={handleAddSubject}
                  className={styles.addSubjectButton}
                >
                  Add
                </button>
              </div>
            </div>
          </>
        )}
      </form>
      <div className={styles.spacer} />
      <div className={styles.buttonsContainer}>
        <button
          type="button"
          onClick={onCancel}
          className={`${styles.formButton} ${styles.cancelButton}`}
        >
          Cancel
        </button>
        <button type="submit" className={styles.formButton}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default UserApprovalForm;
