"use client";

import { db } from '@/lib/firebase/clientApp';
import { addStudentToFirestore } from '@/lib/firebase/firestoreStudent';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

const StudentPage = () => {

    const handleAddStudent = async () => {
        try {
            await addStudentToFirestore('asdf');
            console.log("Student added successfully");
        } catch (error) {
            console.error("Failed to add student:", error);
        }
    };

    const [students, setStudents] = useState<Student[]>();

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "students"), (snapshot) => {
            const updatedStudents: Student[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name, // Assuming name is stored in Firestore
            }));
            setStudents(updatedStudents);
        });

        // Cleanup function to unsubscribe from the listener
        return () => unsubscribe();
    }, []);


    return (
        <div>
            <h1>Student</h1>
            <button onClick={handleAddStudent}>add</button>
            <ul>
                {students?.map((student) => (
                    <li key={student.id}>
                        ID: {student.id}, Name: {student.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentPage;