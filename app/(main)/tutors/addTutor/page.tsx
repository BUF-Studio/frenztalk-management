"use client"

import { NextPage } from "next";
import TutorForm from "../tutorForm";
import { useRouter } from "next/router";

const AddTutorPage = () => {



    return (
        <div>
            <h1>Add Tutor</h1>
            <TutorForm ></TutorForm>
        </div>
    );
};

export default AddTutorPage;