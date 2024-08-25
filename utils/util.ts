// util.ts

/**
 * Formats the given date to a readable date format or date and time.
 * @param date - The date string in UTC format
 * @param includeTime - Whether to include the time in the formatted output
 * @returns Formatted date string or an error message if the input is invalid
 */
export function formatDate(date: string | null | undefined, includeTime?: boolean): string {
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

  return date.toLocaleTimeString([], options).replace(/am|pm/i, (match) => match.toUpperCase());
}

/**
 * Formats the given start time and duration to a readable time range.
 * @param startTime - The start time string in UTC format
 * @param duration - The duration in hours
 * @returns Formatted time range string or an error message if the input is invalid
 */
export function formatTimeRange(startTime: string | null | undefined, duration: number | null | undefined): string {
  if (!startTime) {
    console.error("Invalid start time: null or undefined");
    return "Invalid time";
  }

  try {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + (duration ?? 0) * 60 * 60 * 1000);
    return `${formatDateTime(start)} to ${formatDateTime(end)}`;
  } catch (error) {
    console.error("Error formatting time range:", error);
    return "Invalid time range";
  }
}

/**
 * Formats the end date and time based on a start date and duration.
 * @param start - The start time string in UTC format
 * @param duration - The duration in hours
 * @returns Formatted end date string or an error message if the input is invalid
 */
export function formatDateRange(start: string | null | undefined, duration: number | null | undefined): string {
  if (!start) {
    console.error("Invalid start time: null or undefined");
    return "Invalid time";
  }

  try {
    const startDate = new Date(start);
    const endDate = new Date(startDate.getTime() + (duration ?? 0) * 60 * 60 * 1000);
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
