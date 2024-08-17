import React from "react";
import { Check, CreditCard, FileText, User, ArrowRight } from "lucide-react";
import { cn } from "@/utils/manage-class-name";

export type Step = {
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "completed" | "current" | "upcoming";
  link?: string;
};

interface StepperProps {
  steps: Step[];
}

export const Stepper: React.FC<StepperProps> = ({ steps }) => {
  return (
    <ol className="flex w-fit">
      {steps.map((step, index) => (
        <li
          key={index}
          className="flex flex-1 flex-col items-center text-center"
        >
          <div className="flex items-center justify-center w-full mb-4">
            {/* {index !== 0 && ( */}
            <div
              className={cn(
                "flex-1 h-0.5",
                index === 0 ? "bg-transparent" : "bg-gray-200 dark:bg-c"
              )}
            ></div>
            {/* )} */}
            <span
              className={`flex items-center justify-center w-8 h-8 rounded-full lg:h-10 lg:w-10 shrink-0 ${
                step.status === "completed"
                  ? "bg-green-200 dark:bg-green-900"
                  : step.status === "current"
                  ? "bg-blue-200 dark:bg-blue-900"
                  : "bg-gray-100 dark:bg-gray-700 border-gray-200 border-2"
              }`}
            >
              {step.status === "completed" ? (
                <Check className="w-4 h-4 text-green-500 dark:text-green-400" />
              ) : (
                React.cloneElement(step.icon as React.ReactElement, {
                  className: "w-4 h-4 text-gray-500 dark:text-gray-400",
                })
              )}
            </span>
            {/* {index !== steps.length - 1 && index !== 0 && ( */}
            <div
              className={cn(
                "flex-1 h-0.5",
                index !== steps.length - 1 ? "bg-gray-200 dark:bg-gray-700" : "bg-transparent"
              )}
            ></div>
            {/* )} */}
          </div>
          <div className="flex flex-col items-center min-w-32">
            <h3 className="text-sm font-medium">{step.title}</h3>
            {/* <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {step.description}
            </p> */}
          </div>
          {step.link && (
            <button
              className="mt-2 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 flex items-center"
              onClick={() => window.open(step.link, "_blank")}
            >
              Go to step <ArrowRight className="ml-1 h-3 w-3" />
            </button>
          )}
        </li>
      ))}
    </ol>
  );
};
