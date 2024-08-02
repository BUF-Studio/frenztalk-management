import type React from "react";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Event {
  date: string;
  title: string;
}

interface MonthCalendarProps {
  events: Event[];
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

  console.log("Firstday",firstDayOfMonth);

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
        new Date(event.date).toDateString() ===
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
    <div className="w-full h-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 bg-gray-100">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 p-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-bold">
            {day}
          </div>
        ))}
        {Array.from(Array(firstDayOfMonth).keys()).map((i) => (
          <div key={`empty-${i}`} className="h-24 bg-gray-100" />
        ))}
        {Array.from(Array(daysInMonth).keys()).map((i) => {
          const date = i + 1;
          const dayEvents = getEventsForDate(date);
          return (
            <div
              key={`day-${date}`}
              className={`h-24 border border-gray-200 p-1 overflow-hidden ${
                isToday(date) ? "bg-red-200 rounded-full" : ""
              }`}
            >
              <div className="font-semibold">{date}</div>
              {dayEvents.map((event, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  className="text-xs bg-blue-100 rounded p-1 mb-1 truncate"
                >
                  {event.title}
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
