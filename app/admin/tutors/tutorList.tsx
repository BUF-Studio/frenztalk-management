import { useTutors } from '@/lib/context/collection/tutorContext';
import React from 'react';

const TutorList: React.FC = () => {
    const { tutors } = useTutors();


    return (
        <div>
            <h1>Tutor List</h1>
            <ul>
                {tutors.map((tutor) => (
                    <li key={tutor.tutorId}>
                        {tutor.name} - Age: {tutor.age}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TutorList