"use client";

import { addStudent } from '@/lib/firebase/student';
import { Student } from '@/lib/models/student';
import React, { useEffect, useState } from 'react';
import StudentList from './studentList';

const StudentPage = () => {

    const handleAddStudent = async (student: Student) => {
        await addStudent(student);

    }




    // const [students, setStudents] = useState<Student[]>();

    // useEffect(() => {
    //     const unsubscribe = onSnapshot(collection(db, "students"), (snapshot) => {
    //         const updatedStudents: Student[] = snapshot.docs.map((doc) => ({
    //             id: doc.id,
    //             name: doc.data().name, // Assuming name is stored in Firestore
    //         }));
    //         setStudents(updatedStudents);
    //     });

    //     // Cleanup function to unsubscribe from the listener
    //     return () => unsubscribe();
    // }, []);


    return (
        <div>
            <h1>Student</h1>
            <button onClick={
                async () => {
                    const stu = new Student('123', 'asd', 12)
                    await handleAddStudent(stu)
                }}>add</button>
            <StudentList />
        </div>
    );
};

export default StudentPage;