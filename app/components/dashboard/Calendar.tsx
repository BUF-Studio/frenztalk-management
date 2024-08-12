import type React from "react";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Tuition } from "@/lib/models/tuition";
import { cn } from "@/utils/manage-class-name";

interface MonthCalendarProps {
  events: Tuition[];
  onDateSelect: (date: Date) => void;
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({
  events,
  onDateSelect,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [componentSize, setComponentSize] = useState({ width: 0, height: 0 });
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!calendarRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      entries.map((entry) => {
        const { width, height } = entry.contentRect;
        setComponentSize({ width, height });
      });
    });

    resizeObserver.observe(calendarRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const thisMonth = () => {
    setCurrentDate(new Date());
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const getEventsForDate = (date: number) => {
    return events.filter(
      (event) =>
        new Date(event.startTime?.toString() ?? "").toDateString() ===
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          date
        ).toDateString()
    );
  };

  const isSelected = (date: number) =>
    selectedDate?.getDate() === date &&
    selectedDate?.getMonth() === currentDate.getMonth() &&
    selectedDate?.getFullYear() === currentDate.getFullYear();

  const handleDateClick = (date: number) => {
    const newSelectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    );
    setSelectedDate(newSelectedDate);
    if (onDateSelect) onDateSelect(newSelectedDate);
  };

  const isToday = (date: number) => {
    const today = new Date();
    return (
      date === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const getResponsiveStyles = () => {
    const { width } = componentSize;

    if (width < 400) {
      return {
        daySize: "text-sm items-center justify-center",
        headerSize: "text-lg",
        buttonSize: "text-xs h-6",
        showEvents: false,
      };
    }

    if (width < 600) {
      return {
        daySize: "text-sm items-start justify-start",
        headerSize: "text-xl",
        buttonSize: "text-sm h-7",
        showEvents: true,
      };
    }

    return {
      daySize: "text-base items-start justify-start",
      headerSize: "text-2xl",
      buttonSize: "text-base h-8",
      showEvents: true,
    };
  };

  const styles = getResponsiveStyles();

  const totalCells = 42;
  const emptyCellsAtStart = firstDayOfMonth;
  const emptyCellsAtEnd = totalCells - daysInMonth - emptyCellsAtStart;

  return (
    <div
      ref={calendarRef}
      className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex flex-row gap-2">
          <h2 className={cn("font-bold", styles.headerSize)}>
            {monthNames[currentDate.getMonth()]}
          </h2>
          <span className={cn("font-light", styles.headerSize)}>
            {currentDate.getFullYear()}
          </span>
        </div>
        <div className="flex flex-row">
          <button
            type="button"
            onClick={prevMonth}
            className={cn(
              "flex justify-center items-center rounded-full w-8 hover:bg-gray-200 transition-colors duration-200",
              styles.buttonSize
            )}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={thisMonth}
            className={cn(
              "flex items-center justify-center px-2 font-normal leading-none whitespace-nowrap hover:bg-gray-200 transition-colors duration-200 border border-gray-200 rounded-lg",
              styles.buttonSize
            )}
          >
            Today
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className={cn(
              "flex justify-center items-center rounded-full w-8 hover:bg-gray-200 transition-colors duration-200",
              styles.buttonSize
            )}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-l border-gray-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className={cn(
              "text-right font-light text-gray-500 pr-1 border-b border-gray-200 p-1",
              styles.daySize
            )}
          >
            {day}
          </div>
        ))}
        {Array.from({ length: totalCells }).map((_, index) => {
          const isEmptyStart = index < emptyCellsAtStart;
          const isEmptyEnd = index >= emptyCellsAtStart + daysInMonth;
          const date = index - emptyCellsAtStart + 1;
          const dayEvents =
            !isEmptyStart && !isEmptyEnd ? getEventsForDate(date) : [];

          return (
            <button
              type="button"
              key={`cell-${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                index
              }`}
              className={cn(
                "aspect-square border-r border-b border-gray-200 p-1 overflow-hidden",
                isEmptyStart || isEmptyEnd ? "bg-gray-50" : "",
                isToday(date) ? "bg-red-100" : "",
                "transition-colors duration-200 hover:bg-gray-50 flex flex-col",
                styles.daySize
              )}
              onClick={() =>
                !isEmptyStart && !isEmptyEnd && handleDateClick(date)
              }
            >
              {!isEmptyStart && !isEmptyEnd && (
                <>
                  <div
                    className={cn(
                      "flex font-normal h-6 w-6 items-center justify-center",
                      isToday(date) ? "text-red-600" : "",
                      isSelected(date)
                        ? "text-white bg-red-900 rounded-full"
                        : ""
                    )}
                  >
                    {date}
                  </div>
                  {styles.showEvents && dayEvents.length > 0 && (
                    <div className="space-y-1 mt-1 w-full">
                      {dayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="text-xs bg-blue-100 text-blue-800 rounded p-1 truncate"
                        >
                          {event.subjectId}
                        </div>
                      ))}
                    </div>
                  )}
                  {!styles.showEvents && dayEvents.length > 0 && (
                    <div className="mt-1">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    </div>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalendar;
