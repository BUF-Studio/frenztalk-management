// util.ts

/**
 * Formats the given date string to a readable date format.
 * @param dateString - The date string in UTC format
 * @returns Formatted date string or an error message if the input is invalid
 */
export function formatDate(dateString: string | null | undefined): string {
  if (dateString == null) {
    console.error("Invalid date string: null or undefined");
    return "Invalid date";
  }

  try {
    return new Date(dateString).toDateString();
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

/**
 * Formats the given start time and duration to a readable time range.
 * @param startTime - The start time string in UTC format
 * @param duration - The duration in hours
 * @returns Formatted time range string or an error message if the input is invalid
 */
export function formatTimeRange(startTime: string | null | undefined, duration: number | null | undefined): string {
  if (startTime == null) {
    console.error("Invalid start time: null or undefined");
    return "Invalid time";
  }

  try {
    const start = new Date(startTime);
    const end = new Date(start.getTime() + (duration ?? 0) * 60 * 60 * 1000);
    
    const formatOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    
    const formatTime = (date: Date) => 
      date.toLocaleTimeString([], formatOptions)
        .replace(/am|pm/i, (match) => match.toUpperCase());
    
    return `${formatTime(start)} to ${formatTime(end)}`;
  } catch (error) {
    console.error("Error formatting time range:", error);
    return "Invalid time range";
  }
}

export const formatDateRange = (start: string | null | undefined, duration: number | null | undefined): string => {
  if (start == null) {
    console.error("Invalid start time: null or undefined");
    return "Invalid time";
  }

  try {
    const startDate = new Date(start);
    const endDate = new Date(startDate.getTime() + (duration ?? 0) * 60 * 60 * 1000);
    
    const formatOptions: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    
    const formatTime = (date: Date) => 
      date.toLocaleTimeString([], formatOptions)
        .replace(/am|pm/i, (match) => match.toUpperCase());
    
    return `${formatTime(endDate)}`;
  } catch (error) {
    console.error("Error formatting time range:", error);
    return "Invalid time range";
  }
}