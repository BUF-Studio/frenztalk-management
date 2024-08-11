import type React from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Tuition } from "@/lib/models/tuition";

interface MonthCalendarProps {
  events: Tuition[];
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({ events }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

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

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
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

  const isToday = (date: number) => {
    const today = new Date();
    return (
      date === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 bg-gray-100">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 p-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-bold text-gray-500">
            {day}
          </div>
        ))}
        {Array.from(Array(firstDayOfMonth).keys()).map((i) => (
          <div key={`empty-${i}`} className="h-24 bg-gray-50 rounded" />
        ))}
        {Array.from(Array(daysInMonth).keys()).map((i) => {
          const date = i + 1;
          const dayEvents = getEventsForDate(date);
          return (
            <div
              key={`day-${date}`}
              className={`h-24 border border-gray-200 p-2 overflow-hidden ${
                isToday(date) ? "bg-red-100" : ""
              } rounded transition-colors duration-200 hover:bg-gray-50`}
            >
              <div
                className={`font-semibold ${
                  isToday(date) ? "text-red-600" : ""
                }`}
              >
                {date}
              </div>
              {dayEvents.map((event, index) => (
                <div
                  key={`event-${date}-${
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    index
                  }`}
                  className="text-xs bg-blue-100 text-blue-800 rounded p-1 mb-1 truncate"
                >
                  {event.subjectId}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthCalendar;
