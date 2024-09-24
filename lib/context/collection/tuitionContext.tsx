import { AppProps } from "next/app";
import { ScriptProps } from "next/script";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { tuitionsStream } from "@/lib/firebase/tuition";
import { Tuition } from "@/lib/models/tuition";

type TuitionsContextType = {

    tuitions: Tuition[];
    filteredTuitions: Tuition[];
    activeTuitions: Tuition[];
    endTuitions: Tuition[];
    upcomingTuitions: Tuition[];
    totalHours: number;
    endHours: number;
    trialHours: number;
    month: string;
    setMonth: (month: string) => void;

};

const initialContext: TuitionsContextType = {
    tuitions: [],
    filteredTuitions: [],
    activeTuitions: [],
    endTuitions: [],
    upcomingTuitions: [],
    totalHours: 0,
    endHours: 0,
    trialHours: 0,
    month: '',
    setMonth: () => { },
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
    const [filteredTuitions, setFilteredTuitions] = useState<Tuition[]>([]);
    const [activeTuitions, setActiveTuitions] = useState<Tuition[]>([]);
    const [endTuitions, setEndTuitions] = useState<Tuition[]>([]);
    const [upcomingTuitions, setUpcomingTuitions] = useState<Tuition[]>([]);
    const [totalHours, setTotalHours] = useState<number>(0);
    const [endHours, setEndHours] = useState<number>(0);
    const [trialHours, setTrialHours] = useState<number>(0);
    const [month, setMonth] = useState<string>('');

    // Fetch data from Firebase and set up listeners
    useEffect(() => {
        console.log('tuition tutor')
        console.log(tutorId)
        const onUpdate = (tuitions: Tuition[]) => {
            setTuitions(tuitions)

            const now = new Date();
            const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours

            const upcomingTuitions = tuitions.filter(tuition => {
                const starttime = new Date(tuition.startTime); // Convert ISO string to Date object
                return starttime >= now && starttime <= next24Hours; // Check if within 24 hours
            });

            setUpcomingTuitions(upcomingTuitions)


        };
        const unsubscribe = tuitionsStream(onUpdate, tutorId);

        return () => unsubscribe();
    }, [tutorId]);


    // example month = '2024-09';

    useEffect(() => {
        const filteredTuitions = month !== ''
            ? tuitions.filter(tuitions => tuitions.startTime.startsWith(month))
            : tuitions;
        setFilteredTuitions(filteredTuitions)

        const endedTuitions = filteredTuitions.filter(tuition => tuition.status === 'end');
        setEndTuitions(endedTuitions)
        
        const activeTuitions = filteredTuitions.filter(tuition => tuition.status !== 'end');
        setActiveTuitions(activeTuitions)

        const totalHour = filteredTuitions.reduce((sum, tuition) => sum + tuition.duration, 0) / 60;
        setTotalHours(totalHour)

        const endHour = endedTuitions.reduce((sum, tuition) => sum + tuition.duration, 0) / 60;
        setEndHours(endHour)

        const totalTrailDuration = filteredTuitions
            .filter(tuition => tuition.trial === true)
            .reduce((sum, tuition) => sum + tuition.duration, 0)/60;
        setTrialHours(totalTrailDuration)



    }, [tuitions, month]);

    return (
        <TuitionsContext.Provider value={{
            tuitions,
            filteredTuitions,
            activeTuitions,
            endTuitions,
            upcomingTuitions,
            totalHours,
            endHours,
            trialHours,
            month,
            setMonth
        }}>
            {children}
        </TuitionsContext.Provider>
    );
}

export default TuitionsProvider;
