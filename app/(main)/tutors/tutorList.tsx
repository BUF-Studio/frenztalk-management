import { useTutors } from "@/lib/context/collection/tutorContext";
import React from "react";

const TutorList: React.FC = () => {
  const { tutors } = useTutors();

  return (
    <div>
      <h1>Tutor List</h1>
      <ul>
        {tutors.map((tutor) => (
          <li key={tutor.tutorId}>
            {tutor.name} - des: {tutor.des} - pic: {tutor.pic}
            {tutor.subjects?.map((sub, index) => <div key={index}>{sub}</div>)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TutorList;
