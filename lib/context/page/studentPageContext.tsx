import { Student } from "@/lib/models/student";
import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";

type StudentPageContextType = {
  student: Student | null;
  setStudent: (student: Student | null) => void;
};

const initialContext: StudentPageContextType = {
  student: null,
  setStudent: () => { },
};
// Create a context to hold the data
const StudentPageContext = createContext<StudentPageContextType>(initialContext);

export const useStudentPage = () => useContext(StudentPageContext);

function StudentPageProvider({ children }: ScriptProps) {
  const [student, setStudent] = useState<Student | null>(null);

  return (
    <StudentPageContext.Provider value={{ student, setStudent }}>
      {children}
    </StudentPageContext.Provider>
  );
}

export default StudentPageProvider;