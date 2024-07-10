// pages/edit-subject.tsx
import { useAvaSubjects } from "@/lib/context/collection/avaSubjectContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useSubjectPage } from "@/lib/context/page/subjectPageContext";
import { addAvaSubject } from "@/lib/firebase/avaSubject";
import { addSubject } from "@/lib/firebase/subject";
import { AvaSubject } from "@/lib/models/avaSubject";
import { Subject } from "@/lib/models/subject";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditSubject = () => {
    const [name, setName] = useState("");
    const [tutorId, setTutorId] = useState("");
    const [avaSubjectId, setAvaSubjectId] = useState("");


    const { subject, setSubject } = useSubjectPage();
    const { avaSubjects } = useAvaSubjects();
    const { tutors } = useTutors();

    const router = useRouter();

    useEffect(() => {
        if (subject) {
            setName(subject.name);

        }

    }, [subject]);


    const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        if (selectedId !== '') {
            setAvaSubjectId(selectedId);
        }
    };
    const handleTutorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        if (selectedId !== '') {
            setTutorId(selectedId);
        }
    };

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
            if (subject) {
                const updatedSubject = new Subject(
                    subject.id,
                    name,
                    tutorId,
                    avaSubjectId,

                );
                await setSubject(updatedSubject);
            } else {
                const newSubject = new Subject(
                    null,
                    name,
                    tutorId,
                    avaSubjectId,
                );
                await addSubject(newSubject);
            }
            setSubject(null);
        } catch (error) {
            console.error("Failed to add/update subject", error);
        }
    };

    const handleCancel = () => {
        router.push("/subjects");
    };

    // const getSubjectName = (id: string): string => {
    //     let sub = avaSubjects.find((subject) => subject.id === id,)
    //     return sub?.name ?? ''
    // }

    return (
        <div>
            <h1>Edit Subject</h1>
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
                    Tutor:
                    <select
                        value={tutorId ?? ''}
                        onChange={handleTutorChange}
                    >
                        <option value="">Select a Tutor</option>
                        {tutors
                            // .filter((tutor) => !tutors.includes(tutor.id!))
                            .map((tutor, index) => (
                                <option key={index} value={tutor.id!}>
                                    {tutor.name}
                                </option>
                            ))}
                    </select>
                </label>
            </div>
            <div>
                <label>
                    Subject:
                    <select
                        value={avaSubjectId ?? ''}
                        onChange={handleSubjectChange}
                    >
                        <option value="">Select a subject</option>
                        {avaSubjects
                            // .filter((subject) => !subjects.includes(subject.id!))
                            .map((subject, index) => (
                                <option key={index} value={subject.id!}>
                                    {subject.name}
                                </option>
                            ))}
                    </select>
                    {/* <button onClick={handleAddSubject}>Add Subject</button> */}
                </label>
            </div>

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
