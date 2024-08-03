import { Invoice } from "@/lib/models/invoice";
import { Student } from "@/lib/models/student";
import { Tuition } from "@/lib/models/tuition";
import type { Tutor } from "@/lib/models/tutor";
import { AppProps } from "next/app";
import type { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTuitions } from "../collection/tuitionContext";
import { useTutors } from "../collection/tutorContext";
import { useStudents } from "../collection/studentsContext";
import { useInvoices } from "../collection/invoiceContext";

type TutorPageContextType = {
  tutor: Tutor | null;
  setTutor: (tutor: Tutor | null) => void;
  tutorTuition: Tuition[];
  tutorStudent: Student[];
  tutorInvoice: Invoice[];
};

const initialContext: TutorPageContextType = {
  tutor: null,
  setTutor: () => { },
  tutorTuition: [],
  tutorStudent: [],
  tutorInvoice: [],
};
// Create a context to hold the data
const TutorPageContext = createContext<TutorPageContextType>(initialContext);

export const useTutorPage = () => useContext(TutorPageContext);

function TutorPageProvider({ children }: ScriptProps) {

  const { tuitions } = useTuitions();
  const { tutors } = useTutors();
  const { students } = useStudents();
  const { invoices } = useInvoices();


  const [tutor, setTutor] = useState<Tutor | null>(null);

  const [tutorTuition, setTutorTuition] = useState<Tuition[]>([]);
  const [tutorStudent, setTutorStudent] = useState<Student[]>([]);
  const [tutorInvoice, setTutorInvoice] = useState<Invoice[]>([]);


  useEffect(() => {
    if (tutor) {
      // Update studentTuition, studentTutor, and studentInvoice based on the student
      const tuitionList = tuitions.filter(t => t.tutorId === tutor.id);
      const studentList = students.filter(s => tuitionList.some(tuition => tuition.tutorId === s.id));
      const invoiceList = invoices.filter(t => t.tutorId === tutor.id);

      setTutorTuition(tuitionList);
      setTutorStudent(studentList);
      setTutorInvoice(invoiceList);
    } else {
      setTutorTuition([]);
      setTutorStudent([]);
      setTutorInvoice([]);
    }
  }, [tutor, tuitions, students, invoices]);



  return (
    <TutorPageContext.Provider value={{ tutor, setTutor, tutorTuition, tutorStudent, tutorInvoice }}>
      {children}
    </TutorPageContext.Provider>
  );
}

export default TutorPageProvider;
