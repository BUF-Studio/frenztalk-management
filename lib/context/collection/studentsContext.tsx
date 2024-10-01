// import { studentsStream } from "@/lib/firebase/student";
import { studentsStream } from "@/lib/firebase/student";
import { Student } from "@/lib/models/student";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTuitions } from "./tuitionContext";

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
  tutorId?: string | null;
};

export const useStudents = () => useContext(StudentsContext);

function StudentsProvider({ children, tutorId }: StudentsProviderProps) {
  const [students, setStudents] = useState<Student[]>([]);

  const { tuitions } = useTuitions()

  const setStu = (students: Student[]) => {
    if (tutorId) {
      let tutorStudents: Student[] = [];

      students.forEach(student => {
        const checkStudent = tuitions.some(tuition => {

          return tuition.tutorId === tutorId && tuition.studentId === student.id;
        });
        console.log(checkStudent)

        if (checkStudent && !tutorStudents.some(s => s.id === student.id)) {
          tutorStudents.push(student);
        }
      });
      setStudents(tutorStudents);
    } else {
      setStudents(students);
    }
  }

  // Fetch data from Firebase and set up listeners
  useEffect(() => {

    const onUpdate = (students: Student[]) => {
      setStu(students);
    };

    const unsubscribe = studentsStream(onUpdate);

    return () => unsubscribe();
  }, [tutorId, tuitions]);

  return (
    <StudentsContext.Provider value={{ students }}>
      {children}
    </StudentsContext.Provider>
  );
}

export default StudentsProvider;
