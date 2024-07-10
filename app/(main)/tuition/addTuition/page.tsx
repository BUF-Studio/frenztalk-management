"use client";

import { NextPage } from "next";
import TuitionForm from "../tuitionForm";
import { useRouter } from "next/router";

const AddTuitionPage = () => {
  return (
    <div>
      <h1>Add Tuition</h1>
      <TuitionForm></TuitionForm>
    </div>
  );
};

export default AddTuitionPage;
