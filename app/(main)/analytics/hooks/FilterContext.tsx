// components/FilterContext.tsx
"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

type ShowGraphsState = {
  totalUser: boolean;
  totalHours: boolean;
  trialHours: boolean;
  grossProfit: boolean;
};

type FilterContextType = {
  selectedMonth: string;
  setSelectedMonth: Dispatch<SetStateAction<string>>;
  showGraphs: ShowGraphsState;
  setShowGraphs: Dispatch<SetStateAction<ShowGraphsState>>;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedMonth, setSelectedMonth] = useState<string>("June 2023");
  const [showGraphs, setShowGraphs] = useState<ShowGraphsState>({
    totalUser: true,
    totalHours: true,
    trialHours: true,
    grossProfit: true,
  });

  return (
    <FilterContext.Provider
      value={{ selectedMonth, setSelectedMonth, showGraphs, setShowGraphs }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter(): FilterContextType {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}
