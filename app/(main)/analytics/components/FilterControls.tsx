// components/FilterControls.tsx
"use client";

import { CalendarIcon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/app/components/ui/select";
import { useFilter } from "../hooks/FilterContext";
import { ViewOptions } from "./ViewOptions";

export default function FilterControls() {
  const { selectedMonth, setSelectedMonth, showGraphs, setShowGraphs } =
    useFilter();

  return (
    <div className="flex flex-row items-center justify-between">
      <Select value={selectedMonth} onValueChange={setSelectedMonth}>
        <SelectTrigger className="w-[200px] bg-background border-input">
          <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="June 2023">June 2023</SelectItem>
          <SelectItem value="May 2023">May 2023</SelectItem>
          <SelectItem value="April 2023">April 2023</SelectItem>
        </SelectContent>
      </Select>
      <ViewOptions showGraphs={showGraphs} setShowGraphs={setShowGraphs} />
    </div>
  );
}
