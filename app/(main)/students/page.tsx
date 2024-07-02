"use client";

import Link from 'next/link';
import StudentList from './studentList';

const StudentPage = () => {
    
    return (
        <div>
            <h1>Student</h1>
            <StudentList></StudentList>
            <Link href={'/students/addStudent'}>Add Student</Link>
        </div>
        // </StudentsProvider>
    );
};

export default StudentPage;