import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";
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

function TuitionsProvider({ children }: ScriptProps) {
  const [tuitions, Tuitions] = useState<Tuition[]>([]);

  // Fetch data from Firebase and set up listeners
  useEffect(() => {
    const onUpdate = (tuitions: Tuition[]) => {
      console.log(tuitions);
      Tuitions(tuitions);
    };
    const unsubscribe = tuitionsStream(onUpdate);

    return () => unsubscribe();
  }, []);

  return (
    <TuitionsContext.Provider value={{ tuitions }}>
      {children}
    </TuitionsContext.Provider>
  );
}

export default TuitionsProvider;
