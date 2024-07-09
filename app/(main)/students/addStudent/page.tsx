"use client";

import { NextPage } from "next";
import StudentForm from "../studentForm";
import { useRouter } from "next/router";

const AddStudentPage = () => {
  return (
    <div>
      <h1>Add Student</h1>
      <StudentForm />
    </div>
  );
};

export default AddStudentPage;
