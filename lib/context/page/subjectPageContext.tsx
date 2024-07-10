import { Subject } from "@/lib/models/subject";
import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";

type SubjectPageContextType = {
  subject: Subject | null;
  setSubject: (subject: Subject | null) => void;
};

const initialContext: SubjectPageContextType = {
  subject: null,
  setSubject: () => {},
};
// Create a context to hold the data
const SubjectPageContext = createContext<SubjectPageContextType>(initialContext);

export const useSubjectPage = () => useContext(SubjectPageContext);

function SubjectPageProvider({ children }: ScriptProps) {
  const [subject, setSubject] = useState<Subject | null>(null);

  return (
    <SubjectPageContext.Provider value={{ subject, setSubject }}>
      {children}
    </SubjectPageContext.Provider>
  );
}

export default SubjectPageProvider;
