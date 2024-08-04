import { Student } from "@/lib/models/student";
import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTuitions } from "../collection/tuitionContext";
import { useTutors } from "../collection/tutorContext";
import { useStudents } from "../collection/studentsContext";
import { Invoice } from "@/lib/models/invoice";
import { Tutor } from "@/lib/models/tutor";
import { Tuition } from "@/lib/models/tuition";
import { useInvoices } from "../collection/invoiceContext";

type StudentPageContextType = {
  student: Student | null;
  setStudent: (student: Student | null) => void;
  studentTuition: Tuition[];
  studentTutor: Tutor[];
  studentInvoice: Invoice[];
};

const initialContext: StudentPageContextType = {
  student: null,
  setStudent: () => { },
  studentTuition: [],
  studentTutor: [],
  studentInvoice: [],
};
// Create a context to hold the data
const StudentPageContext =
  createContext<StudentPageContextType>(initialContext);

export const useStudentPage = () => useContext(StudentPageContext);

function StudentPageProvider({ children }: ScriptProps) {
  const { tuitions } = useTuitions();
  const { tutors } = useTutors();
  // const { students } = useStudents();
  const { invoices } = useInvoices();


  const [student, setStudent] = useState<Student | null>(null);

  const [studentTuition, setStudentTuition] = useState<Tuition[]>([]);
  const [studentTutor, setStudentTutor] = useState<Tutor[]>([]);
  const [studentInvoice, setStudentInvoice] = useState<Invoice[]>([]);

  useEffect(() => {
    if (student) {
      // Update studentTuition, studentTutor, and studentInvoice based on the student
      const tuitionList = tuitions.filter(t => t.studentId === student.id);
      const tutorList = tutors.filter(t => tuitionList.some(tuition => tuition.tutorId === t.id));
      const invoiceList = invoices.filter(t => t.studentId === student.id);

      setStudentTuition(tuitionList);
      setStudentTutor(tutorList);
      setStudentInvoice(invoiceList);
    } else {
      setStudentTuition([]);
      setStudentTutor([]);
      setStudentInvoice([]);
    }
  }, [student, tuitions, tutors, invoices]);



  return (
    <StudentPageContext.Provider value={{ student, setStudent, studentTuition, studentTutor, studentInvoice }}>
      {children}
    </StudentPageContext.Provider>
  );
}

export default StudentPageProvider;
