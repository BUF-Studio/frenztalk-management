import InvoicesProvider from "@/lib/context/collection/invoiceContext";
import StudentsProvider from "@/lib/context/collection/studentsContext";
import TutorsProvider from "@/lib/context/collection/tutorContext";
import UserProvider from "@/lib/context/collection/userContext";
import type { ScriptProps } from "next/script";
import PageProvider from "./pageProvider";
import SubjectsProvider from "@/lib/context/collection/subjectContext";
import TuitionsProvider from "@/lib/context/collection/tuitionContext";
import UsersProvider from "@/lib/context/collection/usersContext";

function AppProvider({ children }: ScriptProps) {
  return (
    <UserProvider userId="72AiGSs5ZvRLeA9MKEDz88821Y12">
      <StudentsProvider>
        <TutorsProvider>
            <SubjectsProvider>
              <InvoicesProvider>
                <TuitionsProvider>
                  <UsersProvider>


                    <PageProvider>{children}</PageProvider>
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
