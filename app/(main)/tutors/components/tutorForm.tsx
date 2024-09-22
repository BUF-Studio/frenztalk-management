"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTutorPage } from "@/lib/context/page/tutorPageContext";

export default function TutorForm() {
  const router = useRouter();
  // const { subjects } = useSubjects();
  const { tutor, setTutor } = useTutorPage();
  const [name, setName] = useState(tutor?.name || "");
  const [prefer, setPrefer] = useState("");
  const [preferSubject, setPreferSubect] = useState(tutor?.subjects || []);
  const [des, setDes] = useState(tutor?.des || "");
  const [status, setStatus] = useState(tutor?.status || "active");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedTutor = new Tutor(
        tutor!.id,
        name,
        preferSubject,
        des,
        status,
        ""
      );
      await updateTutor(updatedTutor);

      setTutor(updatedTutor);

      router.back();
    } catch (error) {
      console.error("Failed to submit the form", error);
    }
  };

  const addPreferSubject = () => {
    if (prefer !== "") {
      let preSub = preferSubject;
      preSub.push(prefer);
      setPrefer("");
      setPreferSubect(preSub);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="des">Description:</label>
        <input
          type="text"
          id="des"
          value={des}
          onChange={(e) => setDes(e.target.value)}
        />
      </div>
      {/* <div>
                <label htmlFor="age">Age:</label>
                <input
                    type="number"
                    id="age"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                />
            </div> */}
      <div>
        <label htmlFor="status">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="active">Active</option>
          <option value="frozen">Frozen</option>
        </select>
      </div>
      <div>Prefer Subject</div>
      <div>
        {preferSubject.map((subject) => {
          const subjectDetails = subjects.find((sub) => sub.id === subject);
          return (
            <li key={subject}>
              {subjectDetails ? subjectDetails.name : "Unknown Subject"}
            </li>
          );
        })}
      </div>
      <div>
        <label htmlFor="prefer">Add Prefer Subject</label>
        <select value={prefer} onChange={(e) => setPrefer(e.target.value)}>
          <option value="" disabled>
            Choose prefer subject
          </option>

          {subjects
            .filter(
              (sub) => !preferSubject.some((tutorSub) => tutorSub === sub.id)
            )
            .map((sub) => (
              <option key={sub.id} value={sub.id!}>
                {sub.name}
              </option>
            ))}
        </select>
        <button type="button" onClick={() => addPreferSubject()}>
          Add Prefer Subject
        </button>
      </div>
      <div>
        <button type="submit">Save</button>
        <button type="button" onClick={() => router.back()}>
          Cancel
        </button>
      </div>
    </form>
  );
}
