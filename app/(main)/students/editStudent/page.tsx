"use client";

import { NextPage } from "next";
import { useRouter } from "next/router";
import StudentForm from "../studentForm";

const EditStudentPage = () => {
  return (
    <div>
      <h1>Edit Student</h1>
      <StudentForm />
    </div>
  );
};

export default EditStudentPage;
