"use client";

import type React from "react";
import { User, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useSnackbar } from "@/lib/context/component/SnackbarContext";

interface TuitionCardProps {
  subject: string;
  level: string;
  time: string;
  status: string;
  tutor: string;
  student: string;
  price: string;
  meetingLink: string;
}

const TuitionCard: React.FC<TuitionCardProps> = ({
  subject,
  level,
  time,
  status,
  tutor,
  student,
  price,
  meetingLink,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleCopy = async () => {
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
    <div className="w-full mx-auto bg-white rounded-lg border-1 border-grey-60 overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-bold">{subject}</h2>
            <p className="text-gray-500 text-sm">{level ?? "No level found"}</p>
          </div>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
            {status}
          </span>
          {/* <span className="text-lg font-semibold">{time}</span> */}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Status</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Tutor</span>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-200 rounded-full mr-2" />
              <span>{tutor}</span>
            </div>
          </div>

          {/* <div className="flex justify-between items-center">
            <span className="text-gray-600">Student</span>
            <span>{student}</span>
          </div> */}

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Price</span>
            <span className="text-red-500">{price}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Meeting Link</span>
            <div className="flex items-center">
              <span className="text-blue-500 mr-2">{meetingLink}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title={isCopied ? "Copied!" : "Copy to clipboard"}
              >
                {isCopied ? (
                  <Check size={16} className="text-green-500" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TuitionCard;
