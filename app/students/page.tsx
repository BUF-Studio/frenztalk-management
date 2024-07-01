"use client";

import StudentsProvider, { useStudents } from '@/lib/context/studentContext';
import { addStudent } from '@/lib/firebase/student';
import { Student } from '@/lib/models/student';
import React, { useEffect, useState } from 'react';
import StudentList from './studentList';

const StudentPage = () => {






    return (
        // <StudentsProvider>
        <div>
            <h1>Student</h1>

            <StudentList></StudentList>
        </div>
        // </StudentsProvider>

    );
};

export default StudentPage;