"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTuitionPage } from "@/lib/context/page/tuitionPageContext";
import { addTuition, updateTuition } from "@/lib/firebase/tuition";
import { Tuition } from "@/lib/models/tuition";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import Currency from "@/lib/models/currency";
import TuitionStatus from "@/lib/models/tuitionStatus";
import { Invoice } from "@/lib/models/invoice";
import { addInvoice } from "@/lib/firebase/invoice";
import { useLevels } from "@/lib/context/collection/levelContext";
import axios from "axios";
import { InvoiceStatus } from "@/lib/models/invoiceStatus";
import { X } from "lucide-react";
import TextFieldComponent from "@/app/components/general/input/textField";
import SelectFieldComponent from "@/app/components/general/input/selectFieldComponent";
import { capitalizeFirstLetter } from "@/utils/util";
import DatepickerInput from "@/app/components/general/input/datePicker";

interface AddTuitionModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTuitionModalDialog: React.FC<AddTuitionModalDialogProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const { levels } = useLevels();
  const { tuition, student, tutor, subject, setTuition } = useTuitionPage();
  const { students } = useStudents();
  const { tutors } = useTutors();
  const { subjects } = useSubjects();

  const studentOptions = [
    { value: null, label: "Choose Student" },
    ...students.map((student) => ({
      value: student.id,
      label: student.name,
    })),
  ];

  const tutorOptions = [
    { value: null, label: "Choose Tutor" },
    ...tutors.map((tutor) => ({
      value: tutor.id,
      label: tutor.name,
    })),
  ];

  const subjectOptions = [
    { value: null, label: "Choose Subject" },
    ...subjects.map((subject) => ({
      value: subject.id,
      label: subject.name,
    })),
  ];

  const levelOptions = [
    { value: null, label: "Choose Level" },
    ...levels.map((level) => ({
      value: level.id,
      label: level.name,
    })),
  ];

  const statusOptions = Object.values(TuitionStatus).map((statusValue) => ({
    value: statusValue,
    label: statusValue.charAt(0).toUpperCase() + statusValue.slice(1),
  }));

  const currencyOptions = Object.values(Currency).map((currency) => ({
    value: currency,
    label: currency.charAt(0).toUpperCase() + currency.slice(1),
  }));

  // ... (keep all the state variables and useEffect hooks from the original component)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // ... (keep the existing handleSubmit logic)
    onClose(); // Close the modal after successful submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {tuition ? "Edit Class" : "Add Class"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <SelectFieldComponent
            id="student"
            label="Student"
            required
            options={studentOptions}
          />
          <SelectFieldComponent
            id="tutor"
            label="Tutor"
            required
            options={tutorOptions}
          />
          <SelectFieldComponent
            id="subject"
            label="Subject"
            required
            options={subjectOptions}
          />
          <SelectFieldComponent
            id="level"
            label="Level"
            required
            options={levelOptions}
          />
          <SelectFieldComponent
            id="status"
            label="Status"
            required
            options={statusOptions}
          />
          <SelectFieldComponent
            id="currency"
            label="Currency"
            required
            options={currencyOptions}
          />
          <TextFieldComponent id="studentPrice" label="Student Rate" />
          <TextFieldComponent id="tutorPrice" label="Tutor Rate" />

          {/* Add more form fields here with similar styling */}

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-300 dark:bg-neutral-600 text-neutral-800 dark:text-neutral-100 rounded-md hover:bg-neutral-400 dark:hover:bg-neutral-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-neutral-800 dark:bg-neutral-200 text-neutral-100 dark:text-neutral-800 rounded-md hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTuitionModalDialog;
