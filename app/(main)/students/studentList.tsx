import { useStudents } from '@/lib/context/collection/studentsContext';
import { useStudentPage } from '@/lib/context/page/studentPageContext';
import { Student } from '@/lib/models/student';
import { useRouter } from 'next/navigation';
import React from 'react';

const StudentList: React.FC = () => {
    const { students } = useStudents();
    const { setStudent } = useStudentPage();
    const router = useRouter();

    const navi = (student: Student) => {
        console.log('setstudent')
        console.log(student)
        setStudent(student)
        router.push('/students/editStudent')

    }


    return (
        <div>
            <h1>Student List</h1>
            <ul>

                {students.map((student) => (


                    <div onClick={() => navi(student)} key={student.studentId}>
                        <li >
                            {student.name} - Age: {student.age}
                        </li>
                    </div>


                ))}
            </ul>
        </div>
    );
};

export default StudentList