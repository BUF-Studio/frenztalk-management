import { useSubjects } from "@/lib/context/collection/subjectContext";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import React from "react";
import TutorClass from "./tutorClass";

const TutorList: React.FC = () => {
  const { tutors } = useTutors();
  const { tuitions } = useTuitions();
  const { subjects } = useSubjects();

  const tuition = (tutorId: string) => {
    let list: React.JSX.Element[] = []
    tuitions.forEach((tuition) => {
      subjects.forEach((subject) => {
        if (tuition.subjectId === subject.id && subject.tutorId === tutorId) {
          list.push(<div>
            Classes:
            {tuition.name} / {subject.name}
          </div>)
        }

      })
    })
    return list

  }

  return (
    <div>
      <h1>Tutor List</h1>
      <ul>
        {tutors.map((tutor) => (
          
          <li key={tutor.id}>
            {tutor.name} - des: {tutor.des} - pic: {tutor.pic}
            {tutor.subjects?.map((sub, index) => <div key={index}>{sub}</div>)}
            <TutorClass tutorId={tutor.id!}></TutorClass>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TutorList;
