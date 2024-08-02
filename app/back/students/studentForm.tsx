

"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentPage } from '@/lib/context/page/studentPageContext';
import { useStudents } from '@/lib/context/collection/studentsContext';
import { addStudent, updateStudent } from '@/lib/firebase/student';
import { Student } from '@/lib/models/student';

export default function StudentForm() {
    const router = useRouter();
    const { student, setStudent } = useStudentPage();
    const [name, setName] = useState(student?.name || '');
    const [age, setAge] = useState(student?.age || 0);
    const [status, setStatus] = useState("active");



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (Number.isNaN(age)) {
            alert("Please enter a valid age.");
            return;
        }

        try {

            if (student === null) {
                const newStudent = new Student(null, name, age, status, [], []);
                await addStudent(newStudent)

            } else {
                const updatedStudent =  new Student(student.id, name, age, status, student.tuitionsId, student.tutorsId);
                await updateStudent(updatedStudent)

                setStudent(updatedStudent)

            }
            router.back()

        } catch (error) {
            console.error("Failed to submit the form", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="age">Age:</label>
                <input
                    type="number"
                    id="age"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                />
            </div>
            <div>
                <label htmlFor="status">Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="active">Active</option>
                    <option value="frozen">Frozen</option>
                </select>
            </div>
            <div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => router.back()}>Cancel</button>
            </div>
        </form>

    );
}