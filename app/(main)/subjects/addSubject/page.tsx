"use client";

import { NextPage } from "next";
import SubjectForm from "../subjectForm";
import { useRouter } from "next/router";

const AddSubjectPage = () => {
  return (
    <div>
      <h1>Add Subject</h1>
      <SubjectForm></SubjectForm>
    </div>
  );
};

export default AddSubjectPage;
