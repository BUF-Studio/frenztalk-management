"use client";

import type { Student } from "@/lib/models/student";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

interface StudentFormProps {
  onSubmit: (formData: { name: string; age: number}) => Promise<void>;
  student?: Student | null;
  onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onSubmit, student, onCancel }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");

  useEffect(() => {
    if (student) {
      setName(student.name);
      setAge(student.age);
    }
  }, [student]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (age === "" || Number.isNaN(age)) {
      alert("Please enter a valid age.");
      return;
    }

    try {
      await onSubmit({ name, age: Number(age) });
    } catch (error) {
      console.error("Failed to submit the form", error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 shadow-lg">
      <h2 className="text-2xl mb-4">{student ? "Edit Student" : "Add Student"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Age</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value ? Number.parseInt(e.target.value) : "")}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        {/* Uncomment if email is needed */}
        {/* <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div> */}
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded mt-4">
          {student ? "Update Student" : "Add Student"}
        </button>
      </form>
      <button type="button" onClick={onCancel} className="w-full bg-gray-500 text-white p-2 rounded mt-4">
        Back
      </button>
    </div>
  );
};

export default StudentForm;
