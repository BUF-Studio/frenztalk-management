// pages/edit-subject.tsx
import { useAvaSubjects } from "@/lib/context/collection/avaSubjectContext";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useTuitionPage } from "@/lib/context/page/tuitionPageContext";
import { addSubject } from "@/lib/firebase/subject";
import { addTuition } from "@/lib/firebase/tuition";
import { Subject } from "@/lib/models/subject";
import { Tuition } from "@/lib/models/tuition";
import { Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditSubject = () => {
    const [name, setName] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [studentId, setStudentId] = useState("");


    const { tuition, setTuition } = useTuitionPage();
    const { students } = useStudents();
    const { subjects } = useSubjects();

    const router = useRouter();

    useEffect(() => {
        if (tuition) {
            setName(tuition.name);

        }

    }, [tuition]);


    const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        if (selectedId !== '') {
            setSubjectId(selectedId);
        }
    };
    // const handleTutorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    //     const selectedId = event.target.value;
    //     if (selectedId !== '') {
    //         setTutorId(selectedId);
    //     }
    // };

    // const handleAddNewSubject = async () => {
    //     const newSubject = new AvaSubject(null, newSubjectName, newSubjectLevel);
    //     let newSubjectId = await addAvaSubject(newSubject);
    //     if (newSubjectId) {
    //         setSubjects([...subjects, newSubjectId]);
    //         setNewSubjectName("");
    //     }
    // };

    const handleConfirm = async () => {
        try {
            if (tuition) {
                const updatedTuition = new Tuition(
                    tuition.id,
                    name,
                    subjectId,
                    Timestamp.now(),
                    Timestamp.now(),
                    'Active',

                );
                await setTuition(updatedTuition);
            } else {
                const updatedTuition = new Tuition(
                    null,
                    name,
                    subjectId,
                    Timestamp.now(),
                    Timestamp.now(),
                    'Active',
                );
                await addTuition(updatedTuition);
            }
            setTuition(null);
        } catch (error) {
            console.error("Failed to add/update subject", error);
        }
    };

    const handleCancel = () => {
        router.push("/tuitions");
    };


    return (
        <div>
            <h1>Edit Class</h1>
            <div>
                <label>
                    Name:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
            </div>

            <div>
                <label>
                    Subject:
                    <select
                        value={subjectId ?? ''}
                        onChange={handleSubjectChange}
                    >
                        <option value="">Select a Subject</option>
                        {subjects
                            // .filter((tutor) => !tutors.includes(tutor.id!))
                            .map((subject, index) => (
                                <option key={index} value={subject.id!}>
                                    {subject.name}
                                </option>
                            ))}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Student:
                    <select
                        value={studentId ?? ''}
                        onChange={handleSubjectChange}
                    >
                        <option value="">Select a Student</option>
                        {students
                            // .filter((tutor) => !tutors.includes(tutor.id!))
                            .map((student, index) => (
                                <option key={index} value={student.id!}>
                                    {student.name}
                                </option>
                            ))}
                    </select>
                </label>
            </div>
           <div>Status : active</div>
           <div>Time start : choose time</div>

            {/* <div>
                <label>
                    Add Subject:
                    <br></br>
                    <p>Name</p>
                    <input
                        type="text"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                    />
                    <p>Level</p>

                    <input
                        type="text"
                        value={newSubjectLevel}
                        onChange={(e) => setNewSubjectLevel(e.target.value)}
                    />
                    <button onClick={handleAddNewSubject}>Add New Subject</button>
                </label>
            </div> */}


            <div>
                <button onClick={handleConfirm}>Confirm</button>
                <button onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default EditSubject;
