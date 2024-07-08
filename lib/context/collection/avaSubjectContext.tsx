
import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AvaSubject } from "../../models/avaSubject";
import { avaSubjectsStream } from "../../firebase/avaSubject";

type AvaSubjectsContextType = {
  avaSubjects: AvaSubject[];
};

const initialContext: AvaSubjectsContextType = {
  avaSubjects: [],
};
// Create a context to hold the data
const AvaSubjectsContext = createContext<AvaSubjectsContextType>(initialContext);

export const useAvaSubjects = () => useContext(AvaSubjectsContext);

function AvaSubjectsProvider({ children }: ScriptProps) {
  const [avaSubjects, setAvaSubjects] = useState<AvaSubject[]>([]);

  // Fetch data from Firebase and set up listeners
  useEffect(() => {
    const onUpdate = (avaSubjects: AvaSubject[]) => {
      console.log(avaSubjects)
      setAvaSubjects(avaSubjects)
    }
    const unsubscribe = avaSubjectsStream(onUpdate)

    return () => unsubscribe();
  }, []);

  return (
    <AvaSubjectsContext.Provider value={{ avaSubjects }}>
      {children}
    </AvaSubjectsContext.Provider>
  );
}

export default AvaSubjectsProvider;