// import { AppProps } from "next/app";
// import { ScriptProps } from "next/script";
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { Subject } from "../../models/subject";
// import { subjectsStream } from "@/lib/firebase/subject";

// type SubjectsContextType = {
//   subjects: Subject[];
// };

// const initialContext: SubjectsContextType = {
//   subjects: [],
// };
// // Create a context to hold the data
// const SubjectsContext = createContext<SubjectsContextType>(initialContext);

// export const useSubjects = () => useContext(SubjectsContext);

// function SubjectsProvider({ children }: ScriptProps) {
//   const [subjects, Subjects] = useState<Subject[]>([]);

//   // Fetch data from Firebase and set up listeners
//   useEffect(() => {
//     const onUpdate = (subjects: Subject[]) => {
//       console.log(subjects);
//       Subjects(subjects);
//     };
//     const unsubscribe = subjectsStream(onUpdate);

//     return () => unsubscribe();
//   }, []);

//   return (
//     <SubjectsContext.Provider value={{ subjects }}>
//       {children}
//     </SubjectsContext.Provider>
//   );
// }

// export default SubjectsProvider;
