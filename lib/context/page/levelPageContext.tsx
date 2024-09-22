import { Level } from "@/lib/models/level";
import { ScriptProps } from "next/script";
import { createContext, useContext, useState } from "react";

type LevelPageContextType = {
  level: Level | null;
  setLevel: (level: Level | null) => void;
};

const initialContext: LevelPageContextType = {
  level: null,
  setLevel: () => {},
};
// Create a context to hold the data
const LevelPageContext = createContext<LevelPageContextType>(initialContext);

export const useLevelPage = () => useContext(LevelPageContext);

function LevelPageProvider({ children }: ScriptProps) {
  const [level, setLevel] = useState<Level | null>(null);

  return (
    <LevelPageContext.Provider value={{ level, setLevel }}>
      {children}
    </LevelPageContext.Provider>
  );
}

export default LevelPageProvider;
