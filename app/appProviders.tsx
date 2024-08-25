import InvoicesProvider from "@/lib/context/collection/invoiceContext";
import StudentsProvider from "@/lib/context/collection/studentsContext";
import TutorsProvider from "@/lib/context/collection/tutorContext";
import UserProvider from "@/lib/context/collection/userContext";
import type { ScriptProps } from "next/script";
import PageProvider from "./pageProvider";
import SubjectsProvider from "@/lib/context/collection/subjectContext";
import TuitionsProvider from "@/lib/context/collection/tuitionContext";
import UsersProvider from "@/lib/context/collection/usersContext";
import LevelsProvider from "@/lib/context/collection/levelContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

function AppProvider({ children }: ScriptProps) {
  const [firebaseUserId, setFirebaseUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebaseUserId(user.uid);
      } else {
        setFirebaseUserId(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // or your loading component
  }

  if (!firebaseUserId) {
    return <div>Please sign in</div>; // or your sign-in component
  }
  
  return (
    <UserProvider userId="72AiGSs5ZvRLeA9MKEDz88821Y12">
      <StudentsProvider>
        <TutorsProvider>
          <SubjectsProvider>
            <InvoicesProvider>
              <TuitionsProvider>
                <UsersProvider>
                  <LevelsProvider>

                    <PageProvider>{children}</PageProvider>
                  </LevelsProvider>


                </UsersProvider>
              </TuitionsProvider>
            </InvoicesProvider>
          </SubjectsProvider>
        </TutorsProvider>
      </StudentsProvider>
    </UserProvider>
  );
}

export default AppProvider;
