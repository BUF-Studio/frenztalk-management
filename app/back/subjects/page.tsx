"use client";

import { useLevels } from '@/lib/context/collection/levelContext';
import { useSubjects } from '@/lib/context/collection/subjectContext';
import { useLevelPage } from '@/lib/context/page/levelPageContext';
import { useSubjectPage } from '@/lib/context/page/subjectPageContext';
import { Level } from '@/lib/models/level';
import { Subject } from '@/lib/models/subject';
import Link from 'next/link';
import { useRouter } from 'next/navigation';



export default function SubjectList() {
    const { subjects } = useSubjects();
    const { levels } = useLevels();
    const { setSubject } = useSubjectPage();
    const { setLevel } = useLevelPage();
    const router = useRouter();

    const addSubject = () => {
        setSubject(null)
        router.push('/back/subjects/subject/add')
    }
    const addLevel = () => {
        setLevel(null)
        router.push('/back/subjects/level/add')
    }
    const editSubject = (subject: Subject) => {
        setSubject(subject)
        router.push(`/back/subjects/subject/${subject.id}`)
    }
    const editLevel = (level: Level) => {
        setLevel(level)
        router.push(`/back/subjects/level/${level.id}`)
    }

    return (
        <div>
            <div>
                <h1> Level List</h1>
                <ul>
                    {levels.map((level) => (
                        <li key={level.id}>
                            <button onClick={(e) => { editLevel(level) }}>
                                {level.name}
                            </button>
                        </li>
                    ))}
                </ul>
                <button onClick={addLevel}>Add Level</button>
            </div>
            <div>
                <h1> Subject List</h1>
                <ul>
                    {subjects.map((subject) => (

                        <li key={subject.id}>
                            <button onClick={(e) => { editSubject(subject) }}>

                                {subject.name}
                                {levels.find(level => level.id === subject.levelId)?.name ?? ''}
                            </button>

                        </li>
                    ))}
                </ul>
                <button onClick={addSubject}>Add Subject</button>
            </div>

        </div>
    );
}