"use client";

import type { Student } from "@/lib/models/student";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import styles from "@/styles/main/students/StudentForm.module.scss";

interface StudentFormProps {
  onSubmit: (formData: { name: string; age: number; status: string }) => Promise<void>;
  student?: Student | null;
  onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({
  onSubmit,
  student,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [status, setStatus] = useState("active");

  useEffect(() => {
    if (student) {
      setName(student.name);
      setAge(student.age);
      setStatus(student.status || "active");
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (age === "" || Number.isNaN(age)) {
      alert("Please enter a valid age.");
      return;
    }

    try {
      await onSubmit({ name, age: Number(age), status });
    } catch (error) {
      console.error("Failed to submit the form", error);
    }
  };

  return (
    <div className={styles.studentFormContainer}>
      <h2 className={styles.studentFormHeader}>
        {student ? "Edit Student" : "Add Student"}
      </h2>
      <p className={styles.formSectionTitle}>Student Information</p>
      <form onSubmit={handleSubmit} className={styles.studentForm}>
        <div className={styles.formGroup}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) =>
              setAge(e.target.value ? Number.parseInt(e.target.value) : "")
            }
          />
        </div>
        <div className={styles.formGroup}>
          <label>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">Active</option>
            <option value="frozen">Frozen</option>
          </select>
        </div>
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
      </form>
    </div>
  );
};

export default StudentForm;
