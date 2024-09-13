import type React from "react";
import { useState } from "react";
import TextFieldComponent from "@/app/components/general/input/textField";
import { X } from "lucide-react";
import SelectFieldComponent from "@/app/components/general/input/selectFieldComponent";
import Student from "@/lib/models/student";

interface StudentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (student: Partial<Student>) => void;
  initialStudent?: Student | null;
}

const StudentDialog: React.FC<StudentDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialStudent,
}) => {
  const [name, setName] = useState(initialStudent?.name || "");
  const [age, setAge] = useState<number | string>(initialStudent?.age || "");
  const [status, setStatus] = useState(initialStudent?.status || "active");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, age: Number(age), status });
  };

  if (!isOpen) return null;

  const optionsMap = {
    status: [
      { value: "active", label: "Active" },
      { value: "frozen", label: "Frozen" },
    ],
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {initialStudent ? "Edit Student" : "Add Student"}
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
          <TextFieldComponent
            id="name"
            type="text"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextFieldComponent
            id="name"
            type="number"
            label="Age"
            value={age}
            onChange={(e) =>
              setAge(
                e.target.value === "" ? "" : Number.parseInt(e.target.value)
              )
            }
            required
          />
          <SelectFieldComponent
            id="status"
            name="status"
            label="Status"
            required
            options={optionsMap.status}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />

          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-300 dark:bg-neutral-600 text-neutral-800 dark:text-neutral-100 rounded hover:bg-neutral-400 dark:hover:bg-neutral-500 transition-colors font-sans text-xs font-bold uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="block select-none rounded bg-gradient-to-tr from-red-900 to-red-800 py-3 px-6 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentDialog;
