import { useTuitions } from "@/lib/context/collection/tuitionContext";
import React from "react";

const TuitionList: React.FC = () => {
  const { tuitions } = useTuitions();

  return (
    <div>
      <h1>Tuition List</h1>
      <ul>
        {tuitions.map((tuition) => (
          <li key={tuition.id}>
            {tuition.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TuitionList;
