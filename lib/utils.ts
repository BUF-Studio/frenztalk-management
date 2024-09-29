

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Extracts the month from an ISO date string in either numerical or English name format.
 * @param dateString - The ISO date string in UTC format (e.g., "2024-08-29T11:30:00.000Z")
 * @param format - The desired output format: "number" for month as a number (1-12), or "name" for the month's English name (e.g., "August")
 * @returns The month as a number or the month's name in English
 */
export function getMonthFromISOString(
  dateString: string,
  format: "number" | "name" = "number"
): number | string {
  const date = new Date(dateString);
  const monthIndex = date.getMonth(); // 0-based month index

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (format === "name") {
    return monthNames[monthIndex];
  }

  return monthIndex + 1; // 1-based month number
}

/**
 * Capitalizes the first letter of a string.
 * @param str - The string to capitalize
 * @returns The string with the first letter capitalized or an error message if the input is invalid
 */

export function capitalizeFirstLetter(str: string | null | undefined): string {
  if (!str) {
    return "Invalid string";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Copies meeting details to the clipboard.
 *
 * @param meetingLink - The Zoom meeting link
 * @param tutorName - The name of the tutor
 * @param studentName - The name of the student
 * @param subject - The subject of the class
 * @param level - The level of the class
 * @returns A promise that resolves when copying is successful, or rejects with an error
 */
export const copyMeetingLink = async (
  meetingLink: string,
  tutorName: string,
  studentName: string,
  subject: string,
  level: string
): Promise<void> => {
  if (!navigator.clipboard) {
    throw new Error("Clipboard access not available");
  }

  const template = `
Hi, here is the Zoom link for your upcoming class:

Details:
  • Tutor: ${tutorName}
  • Student: ${studentName}
  • Subject: ${subject}
  • Level: ${level}

Zoom Link: ${meetingLink}

Please be ready a few minutes before the scheduled time. If you have any questions or need assistance, feel free to reach out.

Best regards,
Frenztalk
  `.trim();

  try {
    await navigator.clipboard.writeText(template);
  } catch (err) {
    console.error("Failed to copy text: ", err);
    throw new Error("Failed to copy meeting details");
  }
};