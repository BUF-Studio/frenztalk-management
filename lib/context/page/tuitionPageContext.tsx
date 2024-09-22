import { Student } from "@/lib/models/student";
import { Subject } from "@/lib/models/subject";
import { Tuition } from "@/lib/models/tuition";
import { Tutor } from "@/lib/models/tutor";
import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";

type TuitionPageContextType = {
  tuition: Tuition | null;
  student: Student | null;
  tutor: Tutor | null;
  subject: Subject | null;
  setTuition: (tuition: Tuition | null) => void;
  setTuitionStudent: (student: Student | null) => void;
  setTuitionTutor: (tutor: Tutor | null) => void;
  setTuitionSubject: (subject: Subject | null) => void;
};

const initialContext: TuitionPageContextType = {
  tuition: null,
  student: null,
  tutor: null,
  subject: null,
  setTuition: () => { },
  setTuitionStudent: () => { },
  setTuitionTutor: () => { },
  setTuitionSubject: () => { },
};
// Create a context to hold the data
const TuitionPageContext = createContext<TuitionPageContextType>(initialContext);

export const useTuitionPage = () => useContext(TuitionPageContext);

function TuitionPageProvider({ children }: ScriptProps) {
  const [tuition, setTuition] = useState<Tuition | null>(null);
  const [student, setTuitionStudent] = useState<Student | null>(null);
  const [tutor, setTuitionTutor] = useState<Tutor | null>(null);
  const [subject, setTuitionSubject] = useState<Subject | null>(null);

  return (
    <TuitionPageContext.Provider value={{
      tuition,
      student,
      tutor,
      subject,
      setTuition,
      setTuitionStudent,
      setTuitionTutor,
      setTuitionSubject,
    }}>
      {children}
    </TuitionPageContext.Provider>
  );
}

export default TuitionPageProvider;
