import { studentsStream } from "@/lib/firebase/student";
import { Student } from "@/lib/models/student";
import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";

type StudentsContextType = {
  students: Student[];
};

const initialContext: StudentsContextType = {
  students: [],
};
// Create a context to hold the data
const StudentsContext = createContext<StudentsContextType>(initialContext);

export const useStudents = () => useContext(StudentsContext);

function StudentsProvider({ children }: ScriptProps) {
  const [students, setStudents] = useState<Student[]>([]);

  // Fetch data from Firebase and set up listeners
  useEffect(() => {
    const onUpdate = (students: Student[]) => {
      console.log(students)
      setStudents(students)
    }
    const unsubscribe = studentsStream(onUpdate)

    return () => unsubscribe();
  }, []);

  return (
    <StudentsContext.Provider value={{ students }}>
      {children}
    </StudentsContext.Provider>
  );
}

export default StudentsProvider;