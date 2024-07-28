"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { type User, UserRole } from "@/lib/models/user";
import styles from "@/styles/main/users/UserApprovalForm.module.scss";
import { useAvaSubjects } from "@/lib/context/collection/avaSubjectContext";
import { AvaSubject } from "@/lib/models/avaSubject";
import { addAvaSubject } from "@/lib/firebase/avaSubject";

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
  const [role, setRole] = useState<UserRole>(UserRole.NON_VERIFIED);
  const [description, setDescription] = useState("");
  const [subjects, setSubjects] = useState<string[]>([]);
  const { avaSubjects } = useAvaSubjects();
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectLevel, setNewSubjectLevel] = useState("");
  const [addSubject, setAddSubject] = useState<AvaSubject | null>(null);

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
    const subject = avaSubjects.find((sub) => sub.id === id);
    return subject?.name || "";
  };

  const handleRemoveSubject = (id: string) => {
    setSubjects((prevSubjects) => prevSubjects.filter((sub) => sub !== id));
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
            <option value={UserRole.NON_VERIFIED} selected disabled hidden>
              Choose here
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
              <div className={styles.addSubjectContainer}>
                <div className={styles.chooseSubjectContainer}>
                  <label>Subject</label>
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
                </div>
                {/* Education level */}
                <div className={styles.chooseSubjectContainer}>
                  <label>Level</label>
                  <select
                    value={""}
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
