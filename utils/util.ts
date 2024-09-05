// util.ts
// TODO: Move this file to /lib/utils

/**
 * Formats the given date to a readable date format or date and time.
 * @param date - The date string in UTC format
 * @param includeTime - Whether to include the time in the formatted output
 * @returns Formatted date string or an error message if the input is invalid
 */
export function formatDate(
  date: string | null | undefined,
  includeTime?: boolean
): string {
  if (!date) {
    console.error("Invalid date: null or undefined");
    return "Invalid date";
  }

  try {
    const dateObj = new Date(date);
    return includeTime ? formatDateTime(dateObj) : dateObj.toDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

/**
 * Formats a date object to a readable time format.
 * @param date - The date object to format
 * @returns Formatted time string
 */
function formatDateTime(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return date
    .toLocaleTimeString([], options)
    .replace(/am|pm/i, (match) => match.toUpperCase());
}

// Used at tuition card and tuition detail
export const formatTime = (
  date: string | null | undefined,
  duration: number | null | undefined
) => {
  if (!date) {
    console.error("Invalid start time: null or undefined");
    return "Invalid time";
  }
  try {
    // Create a date object in UTC
    const start = new Date(date);
    const end = new Date(start.getTime() + (duration ?? 0) * 60 * 1000);

    const formatOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: 'UTC'  // Specify UTC timezone
    };

    const startTime = start
      .toLocaleTimeString([], formatOptions)
      .replace(/am|pm/i, (match) => match.toUpperCase());
    const endTime = end
      .toLocaleTimeString([], formatOptions)
      .replace(/am|pm/i, (match) => match.toUpperCase());

    return `${startTime} to ${endTime}`;
  } catch (error) {
    console.error("Error formatting time range:", error);
    return "Invalid time range";
  }
};

/**
 * Formats the end date and time based on a start date and duration.
 * @param start - The start time string in UTC format
 * @param duration - The duration in hours
 * @returns Formatted end date string or an error message if the input is invalid
 */
export function formatDateRange(
  start: string | null | undefined,
  duration: number | null | undefined
): string {
  if (!start) {
    console.error("Invalid start time: null or undefined");
    return "Invalid time";
  }

  try {
    const startDate = new Date(start);
    const endDate = new Date(
      startDate.getTime() + (duration ?? 0) * 60 * 60 * 1000
    );
    return formatDateTime(endDate);
  } catch (error) {
    console.error("Error formatting time range:", error);
    return "Invalid time range";
  }
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
