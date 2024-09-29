"use client";


import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import {
  capitalizeFirstLetter,
  copyMeetingLink,
  formatDate,
  formatTime,
} from "@/utils/util";
import { AccessTime, CalendarToday } from "@mui/icons-material";
import { Check, Copy } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import Live from "../ui/icon/live";
import { Badge } from "../ui/badge";
import TuitionStatus from "@/lib/models/tuitionStatus";

interface TuitionCardProps {
  subject: string;
  level?: string;
  time: string;
  duration: number;
  status: string;
  tutor?: string;
  student?: string;
  studentId?: string;
  price: string;
  meetingLink: string;
  onClick?: () => void;
}

const TuitionCard: React.FC<TuitionCardProps> = ({
  subject,
  level,
  time,
  duration,
  status,
  tutor,
  student,
  studentId,
  meetingLink,
  onClick,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const { showSnackbar } = useSnackbar();
  // const { tuitions } = useTuitions();
  // const { invoices } = useInvoices();
  // const { tutors } = useTutors();
  // const { students } = useStudents();

  useEffect(() => {
    const checkIfLive = () => {
      const now = new Date();
      const startTime = new Date(time);
      const endTime = new Date(startTime.getTime() + duration * 60000);
      setIsLive(now >= startTime && now <= endTime);
    };

    checkIfLive();
    const intervalId = setInterval(checkIfLive, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [time, duration]);

  function getStatusVariant(
    status: string | undefined
  ): "default" | "secondary" | "destructive" | "outline" | undefined {
    if (!status) {
      return "destructive";
    }

    switch (status.toLowerCase()) {
      case TuitionStatus.ACTIVE:
        return "default";
      case TuitionStatus.PENDING:
        return "destructive";
      case TuitionStatus.END:
        return "secondary";
      default:
        return "outline";
    }
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      try {
        await copyMeetingLink(
          meetingLink,
          tutor ?? "",
          student ?? "",
          subject,
          level ?? ""
        );
        setIsCopied(true);
        showSnackbar("Meeting link copied to clipboard", "success");
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-pressed="false"
      className="bg-white dark:bg-neutral-800 w-full border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="flex items-center text-neutral-500 dark:text-neutral-400 text-sm mb-1">
            <CalendarToday className="h-4 w-4 mr-2" />
            {formatDate(time)}
          </span>
          <span className="flex items-center text-neutral-500 dark:text-neutral-400 text-sm mb-1">
            <AccessTime className="h-4 w-4 mr-2" />
            {formatTime(time, duration)}
          </span>
          {isLive && (
              <Live />
          )}
        </div>

        <div className="flex justify-between items-start h-fit">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2">
              <h2 className="text-lg font-medium text-neutral-800 dark:text-neutral-100">
                {subject}
              </h2>
              <Badge variant={getStatusVariant(status)}>
                {capitalizeFirstLetter(status)}
              </Badge>
            </div>
            <p className="flex text-neutral-600 dark:text-neutral-400 text-sm justify-start">
              {level ?? "No level found"}
            </p>
            {student && (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Enrolled by{" "}
                  </span>
                  <Link
                    className="text-sm font-medium ml-1 text-neutral-700 dark:text-neutral-300 hover:underline"
                    href={`/students/${studentId}`}
                  >
                    {student}
                  </Link>
                </div>
              </div>
            )}
          </div>
          {tutor && (
            <div className="flex flex-col-reverse justify-between items-end gap-2">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-neutral-200 dark:bg-neutral-600 rounded-full mr-2" />
                <span className="text-sm text-neutral-600 dark:text-neutral-300">
                  {tutor}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center text-left text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
                title={isCopied ? "Copied!" : "Copy to clipboard"}
              >
                <span className="mr-2 text-sm">Copy meeting link</span>
                {isCopied ? (
                  <Check
                    size={16}
                    className="text-green-700 dark:text-green-300"
                  />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TuitionCard;
