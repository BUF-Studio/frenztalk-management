import { createContext, useContext, useEffect, useState } from "react";
import { Student } from "../models/student";
import { studentsStream } from "../firebase/student";

interface StudentContextType {
    students: Student[];
}

// Create the context with initial values
export const StudentContext = createContext<StudentContextType | undefined>(undefined);

// Custom hook to consume the context
export const useStudentContext = () => {
    const context = useContext(StudentContext);
    if (!context) {
        throw new Error('useStudentContext must be used within a StudentProvider');
    }
    return context;
};

// Provider component that wraps your app and provides the context

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        const onUpdate = (students: Student[]) => setStudents(students);

        const unsubscribe = studentsStream(onUpdate);


        return () => unsubscribe();
    }, []);



    const contextValue: StudentContextType = {
        students,
    };

    return (

        <StudentContext.Provider value= { contextValue } >
        { children }
        < /StudentContext.Provider>
        
    );
};