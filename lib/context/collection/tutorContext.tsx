import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Tutor } from "../../models/tutor";
import { tutorsStream } from "../../firebase/tutor";

type TutorsContextType = {
  tutors: Tutor[];
};

const initialContext: TutorsContextType = {
  tutors: [],
};
// Create a context to hold the data
const TutorsContext = createContext<TutorsContextType>(initialContext);

export const useTutors = () => useContext(TutorsContext);

function TutorsProvider({ children }: ScriptProps) {
  const [tutors, setTutors] = useState<Tutor[]>([]);

  // Fetch data from Firebase and set up listeners
  useEffect(() => {
    const onUpdate = (tutors: Tutor[]) => {
      console.log(tutors);
      setTutors(tutors);
    };
    const unsubscribe = tutorsStream(onUpdate);

    return () => unsubscribe();
  }, []);

  return (
    <TutorsContext.Provider value={{ tutors }}>
      {children}
    </TutorsContext.Provider>
  );
}

export default TutorsProvider;
