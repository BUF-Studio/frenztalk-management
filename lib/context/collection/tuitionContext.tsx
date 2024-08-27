import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { tuitionsStream } from "@/lib/firebase/tuition";
import { Tuition } from "@/lib/models/tuition";

type TuitionsContextType = {
  tuitions: Tuition[];
};

const initialContext: TuitionsContextType = {
  tuitions: [],
};
// Create a context to hold the data
const TuitionsContext = createContext<TuitionsContextType>(initialContext);

export const useTuitions = () => useContext(TuitionsContext);

type TuitionsProviderProps = {
  children: ReactNode;
  tutorId?: string | null;
};

function TuitionsProvider({ children, tutorId }: TuitionsProviderProps) {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);

  // Fetch data from Firebase and set up listeners
  useEffect(() => {
    const onUpdate = (tuitions: Tuition[]) => {
      console.log(tuitions);
      setTuitions(tuitions);
    };
    const unsubscribe = tuitionsStream(onUpdate,tutorId);

    return () => unsubscribe();
  }, [tutorId]);

  return (
    <TuitionsContext.Provider value={{ tuitions }}>
      {children}
    </TuitionsContext.Provider>
  );
}

export default TuitionsProvider;
