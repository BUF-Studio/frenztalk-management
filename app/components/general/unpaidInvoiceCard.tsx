"use client";

import { Badge, type BadgeProps } from "@/app/components/general/badge";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import { updateStudent } from "@/lib/firebase/student";
import {
  capitalizeFirstLetter,
  copyMeetingLink,
  formatDate,
  formatDateRange,
  formatTime,
  getMonthFromISOString,
} from "@/utils/util";
import { AccessTime, CalendarToday } from "@mui/icons-material";
import { Ban, CircleOff } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useState } from "react";

interface TuitionCardProps {
  subject: string;
  level?: string;
  startDate: string;
  duration: number;
  status: string;
  tutor?: string;
  student?: string;
  studentStatus?: string;
  studentId?: string;
  price: number;
  currency: string;
  // meetingLink: string;
  onClick: () => any;
  freezeStudent: any;
}

const UnpaidInvoiceCard: React.FC<TuitionCardProps> = ({
  subject,
  level,
  startDate,
  duration,
  status,
  tutor,
  student,
  studentStatus,
  studentId,
  price,
  currency,
  // meetingLink,
  onClick,
  freezeStudent,
}) => {
  const [isFreeze, setIsFreeze] = useState(
    studentStatus == "frozen" ? true : false
  );
  const { showSnackbar } = useSnackbar();

  const daysFromTodayToFirstOfMonth = Math.floor(
    (Date.now() -
      new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const getStatusVariant = (status: string): BadgeProps["variant"] => {
    switch (status.toLowerCase()) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "cancel":
        return "info";
      default:
        return "info";
    }
  };

  const handleFreezeStudent = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      freezeStudent(studentId!, e);
      setIsFreeze(!isFreeze);
      isFreeze
        ? showSnackbar("Student unfreezed", "success")
        : showSnackbar("Student freezed", "success");
    } catch (err) {
      showSnackbar("Failed to freeze or unfreeze student: ", "error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
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
            {getMonthFromISOString(startDate, "name")}
          </span>
          {/* <span className="flex items-center text-neutral-500 dark:text-neutral-400 text-sm mb-1">
            <AccessTime className="h-4 w-4 mr-2" />
            {formatDateRange(startDate, 730, "date")}
          </span> */}
        </div>

        <div className="flex justify-between items-start h-fit">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2">
              <h2
                className={`text-lg font-medium text-neutral-800 ${
                  daysFromTodayToFirstOfMonth > 14
                    ? "dark:text-red-500"
                    : "dark:text-orange-300"
                }`}
              >
                Overdue by {daysFromTodayToFirstOfMonth} days
              </h2>
              {/* TODO : Badge useless here, every type is the same */}
              <Badge variant={getStatusVariant(status)}>
                {capitalizeFirstLetter(status)}
              </Badge>
            </div>
            <p className="flex text-neutral-600 dark:text-neutral-400 text-sm justify-start">
              {currency ?? "Unknown Currency"} {price ?? "No Price found"}
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
              {/* Freeze button */}
              <button
                type="button"
                onClick={handleFreezeStudent}
                className="flex items-center text-left text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
                title={isFreeze ? "Unfreeze Student" : "Freeze Student"}
              >
                <span className="mr-2 text-sm">
                  {isFreeze ? "Unfreeze Student" : "Freeze Student"}
                </span>
                {isFreeze ? (
                  <CircleOff
                    size={16}
                    className="text-green-700 dark:text-white-300"
                  />
                ) : (
                  <Ban size={16} className="text-green-700 dark:text-red-300" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnpaidInvoiceCard;
