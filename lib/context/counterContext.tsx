// context/CounterContext.tsx

import { ScriptProps } from 'next/script';
import React, { createContext, useState, useContext } from 'react';

// Define a type for your context data
type CounterContextType = {
    count: number;
    increment: () => void;
    decrement: () => void;
};

// Create context with initial values
const CounterContext = createContext<CounterContextType>({
    count: 0,
    increment: () => { },
    decrement: () => { },
});

// Custom hook to use CounterContext
export const useCounter = () => useContext(CounterContext);

// Provider component to manage state
export const CounterProvider: React.FC = ({ children }: ScriptProps) => {
    const [count, setCount] = useState(0);

    const increment = () => setCount((prevCount) => prevCount + 1);
    const decrement = () => setCount((prevCount) => prevCount - 1);

    return (
        <CounterContext.Provider value={{ count, increment, decrement }}>
            {children}
        </CounterContext.Provider>
    );
};
