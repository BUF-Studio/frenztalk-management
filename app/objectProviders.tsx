import InvoicesProvider from "@/lib/context/collection/invoiceContext";
import StudentsProvider from "@/lib/context/collection/studentsContext";
import TutorsProvider from "@/lib/context/collection/tutorContext";
import UserProvider, { useUser } from "@/lib/context/collection/userContext";
import type { ScriptProps } from "next/script";
import PageProvider from "./pageProvider";
import SubjectsProvider from "@/lib/context/collection/subjectContext";
import TuitionsProvider from "@/lib/context/collection/tuitionContext";
import UsersProvider from "@/lib/context/collection/usersContext";
import LevelsProvider from "@/lib/context/collection/levelContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { User, UserRole } from "@/lib/models/user";
import PaymentsProvider from "@/lib/context/collection/paymentContext";

function ObjectProvider({ children }: ScriptProps) {
  const { user } = useUser();

  if (user!.role === UserRole.TUTOR) {
    return (
      <StudentsProvider>
        <SubjectsProvider>
          <TuitionsProvider tutorId={user!.id!}>
            <PaymentsProvider tutorId={user!.id!}>
              <LevelsProvider>
                <PageProvider>{children}</PageProvider>
              </LevelsProvider>
            </PaymentsProvider>
          </TuitionsProvider>
        </SubjectsProvider>
      </StudentsProvider>
    )
  }


  return (
    <StudentsProvider>
      <TutorsProvider>
        <SubjectsProvider>
          <InvoicesProvider>
            <PaymentsProvider>
              <TuitionsProvider>
                <UsersProvider>
                  <LevelsProvider>
                    <PageProvider>{children}</PageProvider>
                  </LevelsProvider>
                </UsersProvider>
              </TuitionsProvider>
            </PaymentsProvider>
          </InvoicesProvider>
        </SubjectsProvider>
      </TutorsProvider>
    </StudentsProvider >
  );
}

export default ObjectProvider;
