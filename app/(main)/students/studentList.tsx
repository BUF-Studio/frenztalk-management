import { useStudents } from '@/lib/context/studentContext';
import React from 'react';

const StudentList: React.FC = () => {
    const { students } = useStudents();


    return (
        <div>
            <h1>Student List</h1>
            <ul>
                
                {students.map((student) => (
                    
                    <li key={student.studentId}>
                        {student.name} - Age: {student.age}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentList