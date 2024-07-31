import InvoicesProvider from "@/lib/context/collection/invoiceContext";
import StudentsProvider from "@/lib/context/collection/studentsContext";
import TutorsProvider from "@/lib/context/collection/tutorContext";
import UserProvider from "@/lib/context/collection/userContext";
import InvoicePageProvider from "@/lib/context/page/invoicePageContext";
import StudentPageProvider from "@/lib/context/page/studentPageContext";
import SubjectPageProvider from "@/lib/context/page/subjectPageContext";
import TuitionPageProvider from "@/lib/context/page/tuitionPageContext";
import TutorPageProvider from "@/lib/context/page/tutorPageContext";
import UserPageProvider from "@/lib/context/page/userPageContext";
import type { ScriptProps } from "next/script";

function PageProvider({ children }: ScriptProps) {
  return (
    <StudentPageProvider>
      <TutorPageProvider>
        <UserPageProvider>
          <SubjectPageProvider>
            <TuitionPageProvider>
              <InvoicePageProvider>
                {children}
              </InvoicePageProvider>
            </TuitionPageProvider>
          </SubjectPageProvider>
        </UserPageProvider>
      </TutorPageProvider>
    </StudentPageProvider>
  );
}

export default PageProvider;
