"use client"

import { useState } from "react"
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover"
import { cn } from "@/lib/utils"

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
]

interface MonthPickerProps {
  selectedMonth: string | null
  onMonthSelect: (date: string) => void
}

export function MonthPicker({ selectedMonth, onMonthSelect }: MonthPickerProps) {
  const [viewYear, setViewYear] = useState(() => 
    selectedMonth ? new Date(selectedMonth).getFullYear() : new Date().getFullYear()
  )

  const handleYearChange = (change: number) => {
    setViewYear(prev => prev + change)
  }

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(viewYear, month)
    onMonthSelect(newDate.toISOString())
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Select month"
    const date = new Date(dateString)
    return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`
  }

  const isCurrentlySelected = (month: number) => {
    if (!selectedMonth) return false
    const selectedDate = new Date(selectedMonth)
    return selectedDate.getFullYear() === viewYear && selectedDate.getMonth() === month
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[240px] justify-start text-left font-normal bg-background border-input">
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
          {formatDate(selectedMonth)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="flex flex-col space-y-4 p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleYearChange(-1)}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">{viewYear}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleYearChange(1)}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((month, index) => (
              <Button
              key={month}
              variant={isCurrentlySelected(index) ? "default" : "outline"}
              className={cn(
                "h-9 w-full",
                isCurrentlySelected(index) && "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
              onClick={() => handleMonthSelect(index)}
            >
              {month}
            </Button>
            ))}
          </div>
          {viewYear < 1970 && (
            <p className="text-xs text-muted-foreground text-center">
              Dates before 1970 are not supported
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}