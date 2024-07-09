import { studentsStream } from "@/lib/firebase/student";
import { Student } from "@/lib/models/student";
import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";

type StudentsContextType = {
  students: Student[];
};

const initialContext: StudentsContextType = {
  students: [],
};
// Create a context to hold the data
const StudentsContext = createContext<StudentsContextType>(initialContext);

type StudentsProviderProps = {
  children: ReactNode;
  tutorId?: string;
};


export const useStudents = () => useContext(StudentsContext);

function StudentsProvider({ children,tutorId }: StudentsProviderProps) {
  const [students, setStudents] = useState<Student[]>([]);

  // Fetch data from Firebase and set up listeners
  useEffect(() => {
    const onUpdate = (students: Student[]) => {
      setStudents(students)
    }

    
    const unsubscribe = studentsStream(onUpdate,tutorId)

    return () => unsubscribe();
  }, []);

  return (
    <StudentsContext.Provider value={{ students }}>
      {children}
    </StudentsContext.Provider>
  );
}

export default StudentsProvider;