import { useSubjects } from '@/lib/context/collection/subjectContext';
import { useTuitions } from '@/lib/context/collection/tuitionContext';
import React from 'react';

type TutorClassProps = {
  tutorId: string;
};

const TutorClass: React.FC<TutorClassProps> = ({ tutorId }) => {
  const { tuitions } = useTuitions();
  const { subjects } = useSubjects();

  const classesList: React.ReactNode[] = [];

  tuitions.forEach((tuition) => {
    subjects.forEach((subject) => {
      if (tuition.subjectId === subject.id && subject.tutorId === tutorId) {
        classesList.push(
          <div key={`${tuition.id}-${subject.id}`}>
            Classes: {tuition.name} / {subject.name}
          </div>
        );
      }
    });
  });

  return <>{classesList}</>;
};

export default TutorClass;
