"use client"

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { addSubject, subjectsStream, updateSubject, deleteSubject } from "@/lib/firebase/subject";
import styles from "./Page.module.scss";
import { Subject } from "@/lib/models/subject";
import { XCircle, CheckCircle2, Pencil, CircleMinus, Plus } from "lucide-react";
import { getErrorMessage } from "@/utils/get-error-message";

const SubjectList = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState<string>("");
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [subjectEdits, setSubjectEdits] = useState<{ [key: string]: string }>({});
  const editInputRef = useRef<HTMLInputElement>(null);

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const unsubscribeSubjects = subjectsStream((updatedSubjects) => {
      setSubjects(updatedSubjects);
    });

    return () => unsubscribeSubjects();
  }, []);

  useEffect(() => {
    if (editingSubjectId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingSubjectId]);

  const addItem = () => {
    try {
      if (!newSubjectName.trim()) {
        showSnackbar("Subject name cannot be empty", "error");
        return;
      }
      const newSubject = new Subject(null, newSubjectName.trim());
      addSubject(newSubject);
      setNewSubjectName("");
    } catch (error) {
      showSnackbar(getErrorMessage(error), "error");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  const handleEditSubject = (id: string) => {
    setEditingSubjectId(id);
    setSubjectEdits((prev) => ({
      ...prev,
      [id]: subjects.find((subject) => subject.id === id)?.name || "",
    }));
  };

  const handleConfirmEditSubject = (id: string) => {
    try {
      const updatedSubject = new Subject(id, subjectEdits[id].trim());
      updateSubject(updatedSubject);
      showSnackbar("Subject updated successfully", "success");
      setEditingSubjectId(null);
    } catch (error) {
      showSnackbar(getErrorMessage(error), "error");
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') {
      handleConfirmEditSubject(id);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2>Subjects</h2>
        <p>Manage your subjects here</p>
      </div>
      <div className={styles.cardContent}>
        {subjects.length === 0 && (
          <p className={styles.emptyMessage}>
            No subject available. Type a subject name below to add one.
          </p>
        )}
        {subjects.map((subject) => (
          <div key={subject.id} className={styles.inputGroup}>
            <input
              type="text"
              ref={editingSubjectId === subject.id ? editInputRef : null}
              placeholder="Subject name"
              value={editingSubjectId === subject.id ? subjectEdits[subject.id || ""] : subject.name}
              onChange={(e) => {
                setSubjectEdits((prev) => ({
                  ...prev,
                  [subject.id ? subject.id : ""]: e.target.value,
                }));
              }}
              onKeyPress={(e) => handleEditKeyPress(e, subject.id || "")}
              disabled={editingSubjectId !== subject.id}
            />
            {editingSubjectId === subject.id ? (
              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={() => setEditingSubjectId(null)}
                  className={[styles.btn, styles.btnDelete].join(" ")}
                >
                  <XCircle className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmEditSubject(subject.id ? subject.id : "")}
                  className={[styles.btn, styles.btnSave].join(" ")}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className={styles.buttonGroup}>
                <button
                  type="button"
                  onClick={() => handleEditSubject(subject.id ? subject.id : "")}
                  className={[styles.btnNormal, styles.btn].join(" ")}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteSubject(subject)}
                  className={[styles.btnNormal, styles.btn].join(" ")}
                >
                  <CircleMinus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
        {/* Add new subject */}
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Type new subject name and press Enter"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            type="button"
            onClick={addItem}
            className={[styles.btnAdd, styles.btn].join(" ")}
          >
            <Plus className="w-4 h-4" />
            Add Subject
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectList;