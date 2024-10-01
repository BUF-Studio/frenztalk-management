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
import ZoomAccountsProvider from "@/lib/context/collection/zoomContext";
import MergePaymentsProvider from "@/lib/context/collection/mergePaymentContext";
import MergeInvoicesProvider from "@/lib/context/collection/mergeInvoiceContext";

function ObjectProvider({ children }: ScriptProps) {
    const { user } = useUser();
    console.log('obpro')
    console.log(user?.role)

    if (user?.role === UserRole.TUTOR) {
        console.log('tutor acccc')
        return (
            <TuitionsProvider tutorId={user?.id}>
                <ZoomAccountsProvider>

                    <StudentsProvider tutorId={user?.id}>
                        <SubjectsProvider>
                            <MergePaymentsProvider tutorId={user?.id}>
                                <PaymentsProvider tutorId={user?.id}>
                                    <LevelsProvider>
                                        <PageProvider>{children}</PageProvider>
                                    </LevelsProvider>
                                </PaymentsProvider>
                            </MergePaymentsProvider>
                        </SubjectsProvider>
                    </StudentsProvider>
                </ZoomAccountsProvider>
            </TuitionsProvider>
        )
    }

    if (user?.role === UserRole.ADMIN) {

        return (
            <TuitionsProvider>
                <ZoomAccountsProvider>

                    <StudentsProvider>
                        <TutorsProvider>
                            <SubjectsProvider>
                                <MergeInvoicesProvider>
                                    <InvoicesProvider>
                                        <MergePaymentsProvider>
                                            <PaymentsProvider>
                                                <UsersProvider>
                                                    <LevelsProvider>
                                                        <PageProvider>{children}</PageProvider>
                                                    </LevelsProvider>
                                                </UsersProvider>
                                            </PaymentsProvider>
                                        </MergePaymentsProvider>
                                    </InvoicesProvider>
                                </MergeInvoicesProvider>
                            </SubjectsProvider>
                        </TutorsProvider>
                    </StudentsProvider >
                </ZoomAccountsProvider>
            </TuitionsProvider>
        );
    }
    return (
        <>
            {children}
        </>
    )
}

export default ObjectProvider;
