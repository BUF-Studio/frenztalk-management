// util.ts
// TODO: Move this file to /lib/utils

/**
 * Formats the given date to a readable date format or date and time.
 * @param date - The date string in UTC format
 * @param includeTime - Whether to include the time in the formatted output
 * @returns Formatted date string or an error message if the input is invalid
 */
export function formatDate(dateString: string): string | null | undefined {
  if (!dateString) {
    console.error("Invalid start time: null or undefined");
    return "Invalid time";
  }
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });
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
      timeZone: "UTC", // Specify UTC timezone
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
  duration: number | null | undefined,
  outputFormat?: string | null
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
    return outputFormat === "date"
      ? formatDate(endDate)
      : formatDateTime(endDate);
  } catch (error) {
    console.error("Error formatting time range:", error);
    return "Invalid time range";
  }
}

export const formatDateTimeLocal = (isoString: string): string => {
  console.log("isoString date: ", isoString);
  if (!isoString) return "";

  const date = new Date(isoString);

  // Get the timezone offset in minutes
  const timezoneOffsetInMinutes = date.getTimezoneOffset();
  const utcIsoTime = new Date(date.getTime()).toISOString();

  // Adjust for local timezone offset (convert minutes to milliseconds)
  // const offsetInMilliseconds = timezoneOffsetInMinutes * 60000;
  // const localISOTime = new Date(date.getTime() - offsetInMilliseconds).toISOString();
  return utcIsoTime.slice(0, 16); // Remove seconds and milliseconds
};
