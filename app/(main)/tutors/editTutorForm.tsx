import type React from "react";
import { useState } from "react";
import type { Student } from "@/lib/models/student";
import TextFieldComponent from "@/app/components/general/input/textField";
import { X } from "lucide-react";
import SelectFieldComponent from "@/app/components/general/input/selectFieldComponent";
import { useRouter } from "next/navigation";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import { useTutorPage } from "@/lib/context/page/tutorPageContext";
import { updateTutor } from "@/lib/firebase/tutor";
import { Tutor } from "@/lib/models/tutor";

interface EditTutorFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditTutorForm: React.FC<EditTutorFormProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { subjects } = useSubjects();
  const { tutor, setTutor } = useTutorPage();
  const [name, setName] = useState(tutor?.name || "");
  const [prefer, setPrefer] = useState("");
  const [preferSubject, setPreferSubect] = useState(tutor?.subjects || []);
  const [des, setDes] = useState(tutor?.des || "");
  const [status, setStatus] = useState(tutor?.status || "active");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedTutor = new Tutor(
        tutor?.id ?? "",
        name,
        preferSubject,
        des,
        status,
        ""
      );
      await updateTutor(updatedTutor);

      setTutor(updatedTutor);

      router.back();
    } catch (error) {
      console.error("Failed to submit the form", error);
    }
  };

  const addPreferSubject = () => {
    if (prefer !== "") {
      const preSub = preferSubject;
      preSub.push(prefer);
      setPrefer("");
      setPreferSubect(preSub);
    }
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
            Edit Tutor
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
            id="des"
            type="text"
            label="Description"
            value={des}
            onChange={(e) => setDes(e.target.value)}
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
          <div>Prefer Subject</div>
          <div>
            {preferSubject.map((subject) => {
              const subjectDetails = subjects.find((sub) => sub.id === subject);
              return (
                <li key={subject}>
                  {subjectDetails ? subjectDetails.name : "Unknown Subject"}
                </li>
              );
            })}
          </div>
          <div>
            <label htmlFor="prefer">Add Prefer Subject</label>
            <select value={prefer} onChange={(e) => setPrefer(e.target.value)}>
              <option value="" disabled>
                Choose prefer subject
              </option>

              {subjects
                .filter(
                  (sub) =>
                    !preferSubject.some((tutorSub) => tutorSub === sub.id)
                )
                .map((sub) => (
                  <option key={sub.id} value={sub.id ?? ""}>
                    {sub.name}
                  </option>
                ))}
            </select>
            <button type="button" onClick={() => addPreferSubject()}>
              Add Prefer Subject
            </button>
          </div>

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

export default EditTutorForm;
