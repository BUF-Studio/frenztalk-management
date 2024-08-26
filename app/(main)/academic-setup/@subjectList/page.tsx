"use client";

import React, { useState } from "react";
import { XCircle, CheckCircle2, Pencil, CircleMinus, Plus } from "lucide-react";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import { useSubjectPage } from "@/lib/context/page/subjectPageContext";
import {
  addSubject,
  updateSubject,
  deleteSubject,
} from "@/lib/firebase/subject";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { Subject } from "@/lib/models/subject";
import { useAlert } from "@/lib/context/component/AlertContext";

const SubjectList = () => {
  const { subjects } = useSubjects();

  const [newSubjectName, setNewSubjectName] = useState("");
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [subjectEdits, setSubjectEdits] = useState<{ [key: string]: string }>(
    {}
  );

  const { showSnackbar } = useSnackbar();
  const { showAlert } = useAlert();

  const addItem = () => {
    if (!newSubjectName.trim()) {
      showSnackbar("Subject name cannot be empty", "error");
      return;
    }
    const newSubject = new Subject(null, newSubjectName.trim());
    addSubject(newSubject);
    setNewSubjectName("");
    showSnackbar("Subject added successfully", "success");
  };

  const handleEditSubject = (id: string) => {
    setEditingSubjectId(id);
    setSubjectEdits((prev) => ({
      ...prev,
      [id]: subjects.find((subject) => subject.id === id)?.name || "",
    }));
  };

  const handleConfirmEditSubject = (id: string) => {
    const updatedSubject = new Subject(id, subjectEdits[id].trim());
    updateSubject(updatedSubject);
    showSnackbar("Subject updated successfully", "success");
    setEditingSubjectId(null);
  };

  const handleDeleteSubject = (subject: Subject) => {
    showAlert({
      title: "Confirm Delete Subject?",
      message:
        "Are you sure you want to delete this subject? This action cannot be undone.",
      confirmLabel: "Confirm",
      cancelLabel: "Cancel",
      onConfirm: () => {
        deleteSubject(subject);
        showSnackbar("Subject deleted successfully", "success");
      },
      onCancel: () => {
        return;
      },
    });
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6 flex flex-col h-full mx-auto flex-1">
      <div className="mb-6 flex-shrink-0">
        <h2 className="text-2xl font-bold mb-2 dark:text-neutral-200">Subjects</h2>
        <p className="text-gray-600 dark:text-neutral-400">Manage your subjects here</p>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 mb-6 p-1">
        {subjects.length === 0 && (
          <p className="text-center text-gray-600 dark:text-neutral-400 italic">
            No subject available.
          </p>
        )}
        {subjects.map((subject) => (
          <div key={subject.id} className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-grow px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                         bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100"
              placeholder="Subject name"
              value={
                editingSubjectId === subject.id
                  ? subjectEdits[subject.id ?? ""] || ""
                  : subject.name
              }
              onChange={(e) =>
                setSubjectEdits({
                  ...subjectEdits,
                  [subject.id ?? ""]: e.target.value,
                })
              }
              disabled={editingSubjectId !== subject.id}
            />
            {editingSubjectId === subject.id ? (
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => setEditingSubjectId(null)}
                  className="p-2 bg-red-500 dark:bg-red-600 text-white rounded-md hover:bg-red-600 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmEditSubject(subject.id ?? "")}
                  className="p-2 bg-green-500 dark:bg-green-600 text-white rounded-md hover:bg-green-600 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => handleEditSubject(subject.id ?? "")}
                  className="p-2 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-md hover:bg-gray-300 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSubject(subject)}
                  className="p-2 bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 rounded-md hover:bg-gray-300 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                >
                  <CircleMinus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Add new subject */}
      <div className="flex items-center space-x-2 mt-auto">
        <input
          type="text"
          className="flex-grow px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md text-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                     bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100"
          placeholder="Type new subject name and press Enter"
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addItem()}
        />
        <button
          type="button"
          onClick={addItem}
          className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>
    </div>
  );
};

export default SubjectList;