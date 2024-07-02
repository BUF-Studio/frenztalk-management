import { Student } from "@/lib/models/student";
import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";

type StudentContextType = {
  student: Student | null;
  setStudent: (student: Student | null) => void;
};

const initialContext: StudentContextType = {
  student: null,
  setStudent: () => { },
};
// Create a context to hold the data
const StudentContext = createContext<StudentContextType>(initialContext);

export const useStudent = () => useContext(StudentContext);

function StudentProvider({ children }: ScriptProps) {
  const [student, setStudent] = useState<Student | null>(null);

  return (
    <StudentContext.Provider value={{ student, setStudent }}>
      {children}
    </StudentContext.Provider>
  );
}

export default StudentProvider;