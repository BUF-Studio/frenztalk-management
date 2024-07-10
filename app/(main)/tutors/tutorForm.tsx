// pages/edit-tutor.tsx
import { useAvaSubjects } from "@/lib/context/collection/avaSubjectContext";
import { useTutorPage } from "@/lib/context/page/tutorPageContext";
import { addAvaSubject } from "@/lib/firebase/avaSubject";
import { addTutor } from "@/lib/firebase/tutor";
import { AvaSubject } from "@/lib/models/avaSubject";
import { Subject } from "@/lib/models/subject";
import { Tutor } from "@/lib/models/tutor";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EditTutor = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [subjects, setSubjects] = useState<string[]>([]);
    const [addSubject, setAddSubject] = useState<AvaSubject>();
    const [newSubjectName, setNewSubjectName] = useState("");
    const [freezeAccount, setFreezeAccount] = useState(false);

    const { tutor, setTutor } = useTutorPage();
    const { avaSubjects } = useAvaSubjects();

    const router = useRouter();

    useEffect(() => {
        if (tutor) {
            setName(tutor.name);
            setDescription(tutor.des);
            setSubjects(tutor.subjects);
            setFreezeAccount(tutor.freeze);
        }

    }, [tutor]);

    const handleAddSubject = () => {
        let newList = subjects;
        newList.push(addSubject!.id!);

        setSubjects(newList);
        setAddSubject(undefined);
    };

    const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        if (selectedId !== '') {
            const selected = avaSubjects.find(
                (subject) => subject.id === selectedId,
            );
            setAddSubject(selected);

        }
    };

    const handleAddNewSubject = async () => {
        const newSubject = new AvaSubject(null, newSubjectName);
        let newSubjectId = await addAvaSubject(newSubject);
        if (newSubjectId) {
            setSubjects([...subjects, newSubjectId]);
            setNewSubjectName("");
        }
    };

    const handleConfirm = async () => {
        try {
            if (tutor) {
                const updatedTutor = new Tutor(
                    tutor.id,
                    name,
                    subjects,
                    description,
                    'pic',
                    freezeAccount,


                );
                await setTutor(updatedTutor);
            } else {
                const newTutor = new Tutor(
                    null,
                    name,
                    subjects,
                    description,
                    'pic',
                    freezeAccount,
                );
                await addTutor(newTutor);
            }
            setTutor(null);
        } catch (error) {
            console.error("Failed to add/update tutor", error);
        }
    };

    const handleCancel = () => {
        router.push("/tutors");
    };

    const getSubjectName = (id: string): string => {
        let sub = avaSubjects.find((subject) => subject.id === id,)
        return sub?.name ?? ''
    }

    return (
        <div>
            <h1>Edit Tutor</h1>
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
                    Description:
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>
            </div>
            <div>
                {subjects.map((sub, index) => (
                    <li key={index}>{getSubjectName(sub)}</li>
                ))}
            </div>

            <div>
                <label>
                    Subject:
                    <select
                        value={addSubject ? addSubject!.id! : ''}
                        onChange={handleSubjectChange}
                    >
                        <option value="">Select a subject</option>
                        {avaSubjects
                            .filter((subject) => !subjects.includes(subject.id!))
                            .map((subject, index) => (
                                <option key={index} value={subject.id!}>
                                    {subject.name}
                                </option>
                            ))}
                    </select>
                    <button onClick={handleAddSubject}>Add Subject</button>
                </label>
            </div>

            <div>
                <label>
                    Add Subject:
                    <input
                        type="text"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                    />
                    <button onClick={handleAddNewSubject}>Add New Subject</button>
                </label>
            </div>

            <div>
                <label>
                    Freeze Account:
                    <input
                        type="checkbox"
                        checked={freezeAccount}
                        onChange={(e) => setFreezeAccount(e.target.checked)}
                    />
                </label>
            </div>
            <div>
                <button onClick={handleConfirm}>Confirm</button>
                <button onClick={handleCancel}>Cancel</button>
            </div>
        </div>
    );
};

export default EditTutor;
