"use client"

import { NextPage } from "next";
import { useRouter } from "next/router";
import { useStudent } from "@/lib/context/page/studentContext";
import StudentForm from "../studentForm";

const EditStudentPage = () => {

    const { student } = useStudent();


    return (
        <div>
            <h1>Edit Student</h1>
            <StudentForm/>
        </div>
    );
};

export default EditStudentPage;