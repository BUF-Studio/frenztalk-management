// util.ts

/**
 * Formats the given date string to a readable date format.
 * @param dateString - The date string in UTC format
 * @returns Formatted date string or an error message if the input is invalid
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) {
    console.error("Invalid date string: undefined or empty");
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
export function formatTimeRange(startTime: string | undefined, duration: number | undefined): string {
  if (!startTime) {
    console.error("Invalid start time: undefined or empty");
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
