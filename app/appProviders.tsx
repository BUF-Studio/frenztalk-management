import UserProvider, { useUser } from "@/lib/context/collection/userContext";
import type { ScriptProps } from "next/script";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

function AppProvider({ children }: ScriptProps) {
  const [firebaseUserId, setFirebaseUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // const {user, setUser} = useUser();
  // const [user] = useAuth();
  
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

  if (firebaseUserId === null) {
    return children;
  }

  
  return (
    <UserProvider userId={firebaseUserId}>
      {/* <ObjectProvider> */}
        {children}
      {/* </ObjectProvider> */}
      {/* <StudentsProvider>
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
      </StudentsProvider> */}
    </UserProvider>
  );
}

export default AppProvider;
