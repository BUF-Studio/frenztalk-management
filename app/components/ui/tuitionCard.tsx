"use client";

import type React from "react";
import { User, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";
import Link from "next/link";
import type { Student } from "@/lib/models/student";
import type { Level } from "@/lib/models/level";
import { AccessTime, CalendarToday } from "@mui/icons-material";

interface TuitionCardProps {
  subject: string;
  level?: Level;
  time: string;
  duration: number;
  status: string;
  tutor?: string;
  student?: Student;
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
  price,
  meetingLink,
  onClick,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(meetingLink);
        setIsCopied(true);
        showSnackbar("Meeting link copied to clipboard", "success");
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={onClick}
      onKeyPress={onClick}
      onKeyUp={onClick}
      className="bg-white w-full border-1 border-grey-600 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="flex items-center text-gray-500 text-sm mb-1">
            <CalendarToday className="h-4 w-4 mr-2" />
            {new Date(time).toDateString()}
          </span>
          <span className="flex items-center text-gray-500 text-sm mb-1">
            <AccessTime className="h-4 w-4 mr-2" />
            {new Date(time)
              .toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
              .replace(/am|pm/i, (match) => match.toUpperCase())}{" "}
            to{" "}
            {
              new Date(new Date(time).getTime() + duration * 60 * 60 * 1000)
                .toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
                .replace(/am|pm/i, (match) => match.toUpperCase())
              // (minutes * 60 * 1000) +
              // (seconds * 1000);
            }
          </span>
        </div>

        {/* Half Bottom */}
        <div className="flex justify-between items-start h-fit">
          <div className="flex flex-col gap-1">
            <div className="flex flex-row gap-2">
              <h2 className="text-lg font-medium">{subject}</h2>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {status}
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              {level?.name ?? "No level found"}
            </p>
            {student && (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {/* Registered student */}
                  <span className="text-sm">Enrolled by </span>
                  <Link
                    type="button"
                    className="text-sm font-medium ml-1"
                    href={`/back/students/${student.id}`}
                  >
                    {student.name}
                  </Link>
                </div>
              </div>
            )}
          </div>
          {tutor && (
            <div className="flex flex-col-reverse justify-between items-end gap-2">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-200 rounded-full mr-2" />
                <span className="text-sm">{tutor}</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center text-left text-gray-400 hover:text-gray-600 transition-colors"
                title={isCopied ? "Copied!" : "Copy to clipboard"}
              >
                <span className="mr-2 text-sm">Copy meeting link</span>
                {isCopied ? (
                  <Check size={16} className="text-green-500" />
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
