import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Level } from "../../models/level";
import { levelsStream } from "@/lib/firebase/avaSubject";

type LevelsContextType = {
  levels: Level[];
};

const initialContext: LevelsContextType = {
  levels: [],
};
// Create a context to hold the data
const LevelsContext = createContext<LevelsContextType>(initialContext);

export const useLevels = () => useContext(LevelsContext);

function LevelsProvider({ children }: ScriptProps) {
  const [levels, setLevels] = useState<Level[]>([]);

  // Fetch data from Firebase and set up listeners
  useEffect(() => {
    const onUpdate = (levels: Level[]) => {
      console.log(levels);
      setLevels(levels);
    };
    const unsubscribe = levelsStream(onUpdate);

    return () => unsubscribe();
  }, []);

  return (
    <LevelsContext.Provider value={{ levels }}>
      {children}
    </LevelsContext.Provider>
  );
}

export default LevelsProvider;
