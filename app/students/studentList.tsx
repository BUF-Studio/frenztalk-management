
import { useStudentContext } from '@/lib/context/studentContext';
import React from 'react';

const StudentList: React.FC = () => {
    const { students } = useStudentContext();

    return (
        <div>
            <h2>Student List</h2>
            <ul>
                {students.map(student => (
                    <li key={student.studentId}>
                        {student.name} - Age: {student.age}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudentList;