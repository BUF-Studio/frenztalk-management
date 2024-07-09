import InvoicesProvider from "@/lib/context/collection/invoiceContext";
import StudentsProvider from "@/lib/context/collection/studentsContext";
import TutorsProvider from "@/lib/context/collection/tutorContext";
import UserProvider from "@/lib/context/collection/userContext";
import StudentPageProvider from "@/lib/context/page/studentPageContext";
import TutorPageProvider from "@/lib/context/page/tutorPageContext";
import type { ScriptProps } from "next/script";

function PageProvider({ children }: ScriptProps) {
  return (
    <StudentPageProvider>
      <TutorPageProvider>{children}</TutorPageProvider>
    </StudentPageProvider>
  );
}

export default PageProvider;
