import { Tuition } from "@/lib/models/tuition";
import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";

type TuitionPageContextType = {
  tuition: Tuition | null;
  setTuition: (tuition: Tuition | null) => void;
};

const initialContext: TuitionPageContextType = {
  tuition: null,
  setTuition: () => {},
};
// Create a context to hold the data
const TuitionPageContext = createContext<TuitionPageContextType>(initialContext);

export const useTuitionPage = () => useContext(TuitionPageContext);

function TuitionPageProvider({ children }: ScriptProps) {
  const [tuition, setTuition] = useState<Tuition | null>(null);

  return (
    <TuitionPageContext.Provider value={{ tuition, setTuition }}>
      {children}
    </TuitionPageContext.Provider>
  );
}

export default TuitionPageProvider;
