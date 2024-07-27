import type { Tutor } from "@/lib/models/tutor";
import { AppProps } from "next/app";
import type { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";

type TutorPageContextType = {
  tutor: Tutor | null;
  setTutor: (tutor: Tutor | null) => void;
};

const initialContext: TutorPageContextType = {
  tutor: null,
  setTutor: () => {},
};
// Create a context to hold the data
const TutorPageContext = createContext<TutorPageContextType>(initialContext);

export const useTutorPage = () => useContext(TutorPageContext);

function TutorPageProvider({ children }: ScriptProps) {
  const [tutor, setTutor] = useState<Tutor | null>(null);

  return (
    <TutorPageContext.Provider value={{ tutor, setTutor }}>
      {children}
    </TutorPageContext.Provider>
  );
}

export default TutorPageProvider;
