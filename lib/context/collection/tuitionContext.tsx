import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { tuitionsStream } from "@/lib/firebase/tuition";
import { Tuition } from "@/lib/models/tuition";

type TuitionsContextType = {

    tuitions: Tuition[];
    activeTuitions: Tuition[];
    endTuitions: Tuition[];
    totalHours: Number;
    endHours: Number;
    trialHours: Number;
};

const initialContext: TuitionsContextType = {
    tuitions: [],
    activeTuitions: [],
    endTuitions: [],
    totalHours: 0,
    endHours: 0,
    trialHours: 0,
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
    const [activeTuitions, setActiveTuitions] = useState<Tuition[]>([]);
    const [endTuitions, setEndTuitions] = useState<Tuition[]>([]);
    const [totalHours, setTotalHours] = useState<number>(0);
    const [endHours, setEndHours] = useState<number>(0);
    const [trialHours, setTrialHours] = useState<number>(0);

    // Fetch data from Firebase and set up listeners
    useEffect(() => {
        console.log('tuition tutor')
        console.log(tutorId)
        const onUpdate = (tuitions: Tuition[]) => {
            setTuitions(tuitions)

            const endedTuitions = tuitions.filter(tuition => tuition.status === 'end');
            setEndTuitions(endedTuitions)
            const activeTuitions = tuitions.filter(tuition => tuition.status !== 'end');
            setActiveTuitions(activeTuitions)
            const totalHour = tuitions.reduce((sum, tuition) => sum + tuition.duration, 0) / 60;
            setTotalHours(totalHour)
            const endHour = endedTuitions.reduce((sum, tuition) => sum + tuition.duration, 0) / 60;
            setEndHours(endHour)
            const totalTrailDuration = tuitions
                .filter(tuition => tuition.trial === true)
                .reduce((sum, tuition) => sum + tuition.duration, 0);
            setTrialHours(totalTrailDuration)


        };
        const unsubscribe = tuitionsStream(onUpdate, tutorId);

        return () => unsubscribe();
    }, [tutorId]);

    return (
        <TuitionsContext.Provider value={{
            tuitions,
            activeTuitions,
            endTuitions,
            totalHours,
            endHours,
            trialHours
        }}>
            {children}
        </TuitionsContext.Provider>
    );
}

export default TuitionsProvider;
