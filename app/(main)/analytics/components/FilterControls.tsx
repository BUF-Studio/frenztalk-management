"use client";

import { useState } from "react";
import { useFilter } from "../hooks/FilterContext";
import { ViewOptions } from "./ViewOptions";
import { MonthPicker } from "@/app/components/ui/custom/month-picker";

const MONTHS = [
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

export default function FilterControls() {
  const { selectedMonth, setSelectedMonth, showGraphs, setShowGraphs } =
    useFilter();

  return (
    <div className="flex flex-row items-center justify-between">
      <MonthPicker
        selectedMonth={selectedMonth}
        onMonthSelect={setSelectedMonth}
      />{" "}
      <ViewOptions showGraphs={showGraphs} setShowGraphs={setShowGraphs} />
    </div>
  );
}
