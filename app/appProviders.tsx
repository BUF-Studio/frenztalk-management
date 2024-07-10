import InvoicesProvider from "@/lib/context/collection/invoiceContext";
import StudentsProvider from "@/lib/context/collection/studentsContext";
import TutorsProvider from "@/lib/context/collection/tutorContext";
import UserProvider from "@/lib/context/collection/userContext";
import StudentProvider from "@/lib/context/page/studentPageContext";
import type { ScriptProps } from "next/script";
import PageProvider from "./pageProvider";
import { AvaSubject } from "@/lib/models/avaSubject";
import AvaSubjectsProvider from "@/lib/context/collection/avaSubjectContext";
import SubjectsProvider from "@/lib/context/collection/subjectContext";
import TuitionsProvider from "@/lib/context/collection/tuitionContext";

function AppProvider({ children }: ScriptProps) {
  return (
    <UserProvider userId="72AiGSs5ZvRLeA9MKEDz88821Y12">
      <StudentsProvider>
        <TutorsProvider>
          <AvaSubjectsProvider>
            <SubjectsProvider>
              <InvoicesProvider>
                <TuitionsProvider>

                  <PageProvider>{children}</PageProvider>
                </TuitionsProvider>
              </InvoicesProvider>
            </SubjectsProvider>
          </AvaSubjectsProvider>
        </TutorsProvider>
      </StudentsProvider>
    </UserProvider>
  );
}

export default AppProvider;
