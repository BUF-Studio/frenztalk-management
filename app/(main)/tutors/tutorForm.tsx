// pages/edit-tutor.tsx
import { useAvaSubjects } from '@/lib/context/collection/avaSubjectContext';
import { useTutorPage } from '@/lib/context/page/tutorPageContext';
import { addAvaSubject } from '@/lib/firebase/avaSubject';
import { AvaSubject } from '@/lib/models/avaSubject';
import { Subject } from '@/lib/models/subject';
import { Tutor } from '@/lib/models/tutor';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';



const EditTutor = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [subjects, setSubjects] = useState<string[]>([]);
    const [addSubject, setAddSubject] = useState<AvaSubject | undefined>(undefined);
    const [newSubjectName, setNewSubjectName] = useState('');
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
        newList.push(addSubject!.avaSubjectId!)

        setSubjects(newList)
        setAddSubject(undefined);

    };

    const handleSubjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = event.target.value;
        const selected = avaSubjects.find(subject => subject.avaSubjectId === selectedId);
        setAddSubject(selected);
    };



    const handleAddNewSubject = async () => {
        const newSubject = new AvaSubject(null, newSubjectName);
        let newSubjectId = await addAvaSubject(newSubject);
        if (newSubjectId) {
            setSubjects([...subjects, newSubjectId]);
            setNewSubjectName('');
        }

    };

    const handleConfirm = () => {

    };

    const handleCancel = () => {
        router.push('/tutors')
    };

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
                    <li key={index}>
                        {sub}
                    </li>
                ))}
            </div>

            <div>
                <label>
                    Subject:
                    <select value={addSubject ? addSubject.avaSubjectId! : ''}
                        onChange={handleSubjectChange}>
                        {avaSubjects
                            .filter((subject) => !subjects.includes(subject.avaSubjectId!))
                            .map((subject, index) => (

                                <option key={index} value={subject.avaSubjectId!} >
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
        </div >
    );
};

export default EditTutor;
