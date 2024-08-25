"use client";

import { useLevels } from "@/lib/context/collection/levelContext";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import { useLevelPage } from "@/lib/context/page/levelPageContext";
import { useSubjectPage } from "@/lib/context/page/subjectPageContext";
import { useTuitionPage } from "@/lib/context/page/tuitionPageContext";
import type { Level } from "@/lib/models/level";
import type { Subject } from "@/lib/models/subject";
import { useRouter } from "next/navigation";

export default function SubjectList() {
  const { subjects } = useSubjects();
  const { levels } = useLevels();
  const { setSubject } = useSubjectPage();
  const { setLevel } = useLevelPage();
  const router = useRouter();
  const { setTuitionSubject } = useTuitionPage();

  const addSubject = () => {
    setSubject(null);
    router.push("/back/academic-setup/subject/add");
  };
  const addLevel = () => {
    setLevel(null);
    router.push("/back/academic-setup/level/add");
  };
  const editSubject = (subject: Subject) => {
    setSubject(subject);
    router.push(`/back/academic-setup/subject/${subject.id}`);
  };
  const editLevel = (level: Level) => {
    setLevel(level);
    router.push(`/back/academic-setup/level/${level.id}`);
  };

  const addTuition = (subject: Subject) => {
    setTuitionSubject(subject);
    router.push("/back/tuitions/add");
  };

  return (
    <div>
      <div>
        <h1> Level List</h1>
        <ul>
          {levels.map((level) => (
            <li key={level.id}>
              <button
                type="button"
                onClick={(e) => {
                  editLevel(level);
                }}
              >
                {level.name}
              </button>
            </li>
          ))}
        </ul>
        {/* TODO: When adding level disable or make it become cancel add  */}
        <button type="button" onClick={addLevel}>
          Add Level
        </button>
      </div>
      {/* <div>
                <h1> Subject List</h1>
                <ul>
                    {subjects.map((subject) => (

                        <li key={subject.id}>
                            <button onClick={(e) => { editSubject(subject) }}>

                                {subject.name}
                            </button>
                            <button onClick={(e) => { addTuition(subject) }}>Add Class</button>
                        </li>
                    ))}
                </ul>
                <button onClick={addSubject}>Add Subject</button>
            </div> */}
    </div>
  );
}
