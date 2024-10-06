"use client";

import { InvoiceList } from "@/app/components/main/invoiceList";
import { TutorList } from "@/app/components/main/tutorList";
import { type Step, Stepper } from "@/app/components/general/stepper";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { useTuitionPage } from "@/lib/context/page/tuitionPageContext";
import type { Invoice } from "@/lib/models/invoice";
import type { Tutor } from "@/lib/models/tutor";
import {
  formatDate,
  formatTime,
} from "@/utils/util";
import {
  AccessTime,
  ArrowBackIosNew,
  CalendarToday,
} from "@mui/icons-material";
import {
  Check,
  Copy,
  CreditCard,
  FileText,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import DropdownButton from "@/app/components/general/dropdown";
import { useAlert } from "@/lib/context/component/AlertContext";
import { deleteTuition } from "@/lib/firebase/tuition";
// import { AddTuitionModalDialog } from "../tuitionModalDialog";
import { useSubjects } from "@/lib/context/collection/subjectContext";
import type { Level } from "@/lib/models/level";
import type { Student } from "@/lib/models/student";
import type { Subject } from "@/lib/models/subject";
import { useInvoices } from "@/lib/context/collection/invoiceContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useLevels } from "@/lib/context/collection/levelContext";
import { Badge } from "@/app/components/ui/badge";
import TuitionStatus from "@/lib/models/tuitionStatus";
import { copyMeetingLink, capitalizeFirstLetter } from "@/lib/utils";
import { useUser } from "@/lib/context/collection/userContext";
import { UserRole } from "@/lib/models/user";

export default function TuitionDetail({ params }: { params: { id: string } }) {
  const { tuition, setTuition } = useTuitionPage();
  const { tuitions } = useTuitions();
  const { invoices } = useInvoices();
  const router = useRouter();
  const { user } = useUser();
  const { tutors } = useTutors();
  const { students } = useStudents();
  const { subjects } = useSubjects();
  const { levels } = useLevels();
  const [isCopied, setIsCopied] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { showAlert } = useAlert();
  const [isModalOpen, setIsModalOpen] = useState(false);

  function getStatusVariant(
    status: string | undefined
  ): "default" | "secondary" | "destructive" | "outline" | undefined {
    switch (status?.toLowerCase()) {
      case TuitionStatus.ACTIVE:
        return "default";
      case TuitionStatus.END:
        return "outline";
      case TuitionStatus.PENDING:
        return "destructive";
      default:
        return "destructive";
    }
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      try {
        if (tuition) {
          await copyMeetingLink(
            tuition.url ?? "",
            findTutor(tuition.tutorId)?.name ?? "",
            findStudent(tuition.studentId)?.name ?? "",
            findSubject(tuition.subjectId)?.name ?? "",
            findLevel(tuition.levelId)?.name ?? ""
          );
          setIsCopied(true);
          showSnackbar("Meeting link copied to clipboard", "success");
          setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        }
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  useEffect(() => {
    if (tuition === null || tuition.id !== params.id) {
      const foundTuition = tuitions.find((s) => s.id === params.id);
      if (foundTuition) setTuition(foundTuition);
    }
  }, [params, tuition, tuitions, setTuition]);

  const findTutor = (id: string | undefined): Tutor | undefined => {
    if (!id) return undefined;
    return tutors.find((tutor) => tutor.id === id);
  };

  const findInvoice = (id: string | undefined): Invoice | undefined => {
    if (!id) return undefined;
    return invoices.find((invoice) => invoice.id === id);
  };

  const findStudent = (id: string | undefined): Student | undefined => {
    if (!id) return undefined;
    return students.find((student) => student.id === id);
  };

  const findSubject = (id: string | undefined): Subject | undefined => {
    if (!id) return undefined;
    return subjects.find((subject) => subject.id === id);
  };

  const findLevel = (id: string | undefined): Level | undefined => {
    if (!id) return undefined;
    return levels.find((level) => level.id === id);
  };

  const steps: Step[] = [
    {
      title: "Registered",
      description: "Enter your personal details",
      icon: <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />,
      status: "completed",
    },
    {
      title: "Meeting",
      description: "Set up your account",
      icon: <CreditCard className="w-4 h-4 text-gray-500 dark:text-gray-400" />,
      status: "completed",
      link: tuition?.url,
    },
    {
      title: "Completed",
      description: "Review your information",
      icon: <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />,
      status: "completed",
    },
  ];

  // TODO - Implement delete tuition
  const handleDelete = useCallback(() => {
    if (tuition) {
      showAlert({
        title: "Confirm Delete Class?",
        message:
          "Are you sure you want to delete this tuition? This action cannot be undone.",
        confirmLabel: "Confirm",
        cancelLabel: "Cancel",
        onConfirm: async () => {
          await deleteTuition(tuition);
          router.back();
          showSnackbar("Tuition deleted successfully", "success");
        },
        onCancel: () => { },
      });
    }
  }, [tuition, showAlert, showSnackbar, router]);

  function handleEdit(): void {
    // setIsModalOpen(true);
    router.push(`/tuitions/${tuition?.id}/update`);
  }

  const invoice = findInvoice(tuition?.studentInvoiceId ?? "");

  return (
    <div>
      {/* Back Button */}
      <button
        type="button"
        onClick={(e) => {
          setTuition(null);
          router.back();
        }}
        className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors mb-4"
      >
        <ArrowBackIosNew className="h-5 w-5 mr-2" />
        <h1 className="text-lg font-semibold">Class Details</h1>
      </button>

      {/* Class Details Section */}
      <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-6 mb-4">
        <div className="flex justify-between items-start flex-col lg:flex-row gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-1">
                <div className="text-lg font-medium dark:text-neutral-100">
                  {tuition?.name.toUpperCase()}
                </div>
                <p className="text-gray-500 dark:text-neutral-400 text-sm">
                  {findLevel(tuition?.levelId)?.name}
                </p>
              </div>
              <Badge variant={getStatusVariant(tuition?.status ?? "")}>
                {capitalizeFirstLetter(tuition?.status)}
              </Badge>
              <DropdownButton
                title="..."
                arrowDown={false}
                items={[
                  {
                    icon: <Pencil size={16} />,
                    label: "Edit",
                    onClick: handleEdit,
                  },
                  {
                    icon: <Trash2 size={16} />,
                    label: "Delete",
                    onClick: async () => {
                      handleDelete();
                      return;
                    },
                  },
                ]}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm dark:text-neutral-300">
                Enrolled by{" "}
              </span>
              <Link
                className="text-sm font-medium ml-1 dark:text-neutral-100 hover:underline"
                href={`/students/${tuition?.studentId}`}
              >
                {findStudent(tuition?.studentId ?? "")?.name}
              </Link>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center text-gray-500 dark:text-neutral-400 text-sm">
                <CalendarToday className="h-4 w-4 mr-2" />
                {formatDate(tuition?.startTime!)}
              </span>
              <span className="flex items-center text-gray-500 dark:text-neutral-400 text-sm">
                <AccessTime className="h-4 w-4 mr-2" />
                {formatTime(tuition?.startTime, tuition?.duration)}
              </span>
            </div>
          </div>
          <Stepper steps={steps} />
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Side */}
        <div className="flex-grow">
          <div className="mb-2">
            <h1 className="text-lg font-normal dark:text-neutral-200">
              Classes
            </h1>
          </div>
          <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900 dark:text-neutral-100">
                Meeting Link
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center text-left text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors"
                title={isCopied ? "Copied!" : "Copy to clipboard"}
              >
                <span className="mr-2 text-sm">Copy meeting link</span>
                {isCopied ? (
                  <Check
                    size={16}
                    className="text-green-500 dark:text-green-400"
                  />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
            {
              user?.role === UserRole.ADMIN &&
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-neutral-100">
                  Student Price
                </span>
                <span className="text-sm dark:text-neutral-300">
                  {tuition?.currency} {tuition?.studentPrice}
                </span>
              </div>
            }
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900 dark:text-neutral-100">
                Tutor Price
              </span>
              <span className="text-sm dark:text-neutral-300">
                {tuition?.currency} {tuition?.tutorPrice}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="lg:w-[300px] flex-shrink-0 flex flex-col gap-4">
          <TutorList
            tutors={[findTutor(tuition?.tutorId ?? "") || ({} as Tutor)]}
          />
          <InvoiceList
            invoices={invoice ? [invoice as Invoice] : []}
            studentId={tuition?.studentId ?? ""}
          />
        </div>
      </div>
      {/* <AddTuitionModalDialog
        isOpen={isModalOpen}
        onClose={() => {
          // setTuition(null)
          setIsModalOpen(false);
        }}
        tuition={tuition}
        setTuition={setTuition}
      /> */}
    </div>
  );
}
