"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Tuition } from "@/lib/models/tuition"
import { cn } from "@/utils/manage-class-name"
import { Subject } from "@/lib/models/subject"
import { utcIsoStringToLocalTime } from "@/utils/util"

interface MonthCalendarProps {
  events: Tuition[]
  onDateSelect: (date: Date) => void
  onResetDateSelect?: boolean
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({
  events,
  onDateSelect,
  onResetDateSelect,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [componentSize, setComponentSize] = useState({ width: 0, height: 0 })
  const [resetDateSelect, setResetDateSelect] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])

  useEffect(() => {
    // fetchSubjects()
  }, [])

  async function fetchSubjects() {
    // Implement your subject fetching logic here
    // For now, we'll use an empty array
    setSubjects([])
  }

  useEffect(() => {
    if (!calendarRef.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry.contentRect
        setComponentSize({ width, height })
      })
    })

    resizeObserver.observe(calendarRef.current)

    return () => resizeObserver.disconnect()
  }, [])

  useEffect(() => {
    if (resetDateSelect) {
      setSelectedDate(null)
      setResetDateSelect(false)
    }
  }, [resetDateSelect])

  useEffect(() => {
    if (onResetDateSelect) {
      setResetDateSelect(true)
    }
  }, [onResetDateSelect])

  const findSubject = (id: string) => {
    return subjects.find((subject) => subject.id === id)
  }

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate()
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay()

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
  ]

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    )
  }

  const thisMonth = () => {
    setCurrentDate(new Date())
  }

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    )
  }

  const getEventsForDate = (date: number) => {
    const dayEvents = events.filter((event) => {
      if (!event.startTime) return false
      const localEventDate = utcIsoStringToLocalTime(event.startTime)
      return (
        localEventDate.getDate() === date &&
        localEventDate.getMonth() === currentDate.getMonth() &&
        localEventDate.getFullYear() === currentDate.getFullYear()
      )
    })

    dayEvents.sort(
      (a, b) =>
        utcIsoStringToLocalTime(a.startTime ?? "").getTime() -
        utcIsoStringToLocalTime(b.startTime ?? "").getTime()
    )

    return {
      topEvents: dayEvents.slice(0, 1),
      moreCount: dayEvents.length - 1,
    }
  }

  const isSelected = (date: number) =>
    selectedDate?.getDate() === date &&
    selectedDate?.getMonth() === currentDate.getMonth() &&
    selectedDate?.getFullYear() === currentDate.getFullYear()

  const handleDateClick = (date: number) => {
    const newSelectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    )
    setSelectedDate(newSelectedDate)
    if (onDateSelect) onDateSelect(newSelectedDate)
  }

  const isToday = (date: number) => {
    const today = new Date()
    return (
      date === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    )
  }

  const getResponsiveStyles = () => {
    const { width } = componentSize

    if (width < 400) {
      return {
        daySize: "text-sm items-center justify-center",
        headerSize: "text-lg",
        buttonSize: "text-xs h-6",
        showEvents: false,
      }
    }

    if (width < 600) {
      return {
        daySize: "text-sm items-start justify-start",
        headerSize: "text-xl",
        buttonSize: "text-sm h-7",
        showEvents: true,
      }
    }

    return {
      daySize: "text-base items-start justify-start",
      headerSize: "text-2xl",
      buttonSize: "text-base h-8",
      showEvents: true,
    }
  }

  const styles = getResponsiveStyles()

  const totalCells = 42
  const emptyCellsAtStart = firstDayOfMonth
  const emptyCellsAtEnd = totalCells - daysInMonth - emptyCellsAtStart

  return (
    <div
      ref={calendarRef}
      className="w-full h-full max-w-3xl mx-auto bg-white dark:bg-neutral-800 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-600"
    >
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex flex-row gap-2">
          <h2
            className={cn(
              "font-bold text-neutral-800 dark:text-neutral-200",
              styles.headerSize
            )}
          >
            {monthNames[currentDate.getMonth()]}
          </h2>
          <span
            className={cn(
              "font-light text-neutral-600 dark:text-neutral-400",
              styles.headerSize
            )}
          >
            {currentDate.getFullYear()}
          </span>
        </div>
        <div className="flex flex-row">
          <button
            type="button"
            onClick={prevMonth}
            className={cn(
              "flex justify-center items-center rounded-full w-8 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200",
              styles.buttonSize
            )}
          >
            <ChevronLeft className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
          </button>
          <button
            type="button"
            onClick={thisMonth}
            className={cn(
              "flex items-center justify-center px-2 font-normal leading-none whitespace-nowrap hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200 border border-neutral-200 dark:border-neutral-600 rounded-lg text-neutral-600 dark:text-neutral-400",
              styles.buttonSize
            )}
          >
            Today
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className={cn(
              "flex justify-center items-center rounded-full w-8 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors duration-200",
              styles.buttonSize
            )}
          >
            <ChevronRight className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div
            key={day}
            className={cn(
              "text-right font-light text-neutral-500 dark:text-neutral-400 pr-1 border-b border-neutral-200 dark:border-neutral-700 p-1",
              index === 6 && "border-r-0",
              styles.daySize
            )}
          >
            {day}
          </div>
        ))}
        {Array.from({ length: totalCells }).map((_, index) => {
          const isEmptyStart = index < emptyCellsAtStart
          const isEmptyEnd = index >= emptyCellsAtStart + daysInMonth
          const date = index - emptyCellsAtStart + 1
          const { topEvents, moreCount } =
            !isEmptyStart && !isEmptyEnd
              ? getEventsForDate(date)
              : { topEvents: [], moreCount: 0 }

          const isLastColumn = (index + 1) % 7 === 0
          const isLastRow = index >= totalCells - 7

          return (
            <button
              type="button"
              key={`cell-${index}`}
              className={cn(
                "aspect-square p-1 overflow-hidden",
                "border-r border-b border-neutral-200 dark:border-neutral-700",
                isLastColumn && "border-r-0",
                isLastRow && "border-b-0",
                isEmptyStart || isEmptyEnd
                  ? "bg-neutral-50 dark:bg-neutral-900"
                  : "",
                isToday(date) ? "bg-red-100 dark:bg-red-900" : "",
                "transition-colors duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex flex-col",
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
                      isToday(date) ? "text-red-600 dark:text-red-300" : "",
                      isSelected(date)
                        ? "text-white bg-red-900 dark:bg-red-700 rounded-full"
                        : ""
                    )}
                  >
                    {date}
                  </div>
                  {styles.showEvents && topEvents.length > 0 && (
                    <div className="space-y-1 mt-1 w-full">
                      {topEvents.map((event) => (
                        <div
                          key={event.id}
                          className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded p-1 truncate text-left"
                        >
                          {findSubject(event.subjectId)?.name}
                        </div>
                      ))}
                      {moreCount > 0 && (
                        <div className="text-xs text-neutral-500 dark:text-neutral-400 text-left px-1">
                          {moreCount} more...
                        </div>
                      )}
                    </div>
                  )}
                  {!styles.showEvents && topEvents.length > 0 && (
                    <div className="mt-1">
                      <div className="w-1.5 h-1.5 bg-red-500 dark:bg-red-400 rounded-full" />
                    </div>
                  )}
                </>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MonthCalendar