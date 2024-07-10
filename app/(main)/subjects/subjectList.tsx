import { useSubjects } from "@/lib/context/collection/subjectContext";
import React from "react";

const SubjectList: React.FC = () => {
  const { subjects } = useSubjects();

  return (
    <div>
      <h1>Subject List</h1>
      <ul>
        {subjects.map((subject) => (
          <li key={subject.id}>
            {subject.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubjectList;
