"use client";

import { UserDistributionChart } from "./charts/user-chart";
import { useFilter } from "../hooks/FilterContext";
import { TrialChart } from "./charts/trial-chart";
import GrossProfitChart from "./charts/gross-profit-chart";
import TotalClassChart from "./charts/total-class-chart";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useEffect } from "react";

export default function GraphGrid() {
  const { showGraphs, selectedMonth } = useFilter();
  const { students } = useStudents();
  const { tutors } = useTutors();

  const studentCount = students.length;
  const tutorCount = tutors.length;

  useEffect(() => {
    students.map((student) => {
      console.log(student.name, student.createdAt);
    });
  }, [students]);

  const trialData = [
    { month: "January", trial: 50, nonTrial: 150 },
    { month: "February", trial: 70, nonTrial: 180 },
    { month: "March", trial: 60, nonTrial: 200 },
    { month: "April", trial: 80, nonTrial: 220 },
    { month: "May", trial: 65, nonTrial: 240 },
    { month: "June", trial: 75, nonTrial: 260 },
  ];

  const grossProfitData = [
    { month: "January", grossProfit: 50000 },
    { month: "February", grossProfit: 62000 },
    { month: "March", grossProfit: 58000 },
    { month: "April", grossProfit: 75000 },
    { month: "May", grossProfit: 80000 },
    { month: "June", grossProfit: 55000 },
  ];

  const totalClassData = [
    { month: "January", totalClasses: 186 },
    { month: "February", totalClasses: 305 },
    { month: "March", totalClasses: 237 },
    { month: "April", totalClasses: 273 },
    { month: "May", totalClasses: 309 },
    { month: "June", totalClasses: 314 },
  ];

  const renderCharts = () => {
    const topRow = [];
    const bottomRow = [];

    if (showGraphs.totalUser) {
      topRow.push(
        <UserDistributionChart key="user" tutorCount={tutorCount} studentCount={studentCount} />
      );
    }

    if (showGraphs.totalHours) {
      topRow.push(
        <TotalClassChart key="totalClass" chartData={totalClassData} />
      );
    }

    if (showGraphs.grossProfit) {
      if (topRow.length < 2) {
        topRow.push(
          <GrossProfitChart key="grossProfit" chartData={grossProfitData} />
        );
      } else {
        bottomRow.push(
          <GrossProfitChart key="grossProfit" chartData={grossProfitData} />
        );
      }
    }

    if (showGraphs.trialHours) {
      if (topRow.length < 2) {
        topRow.push(<TrialChart key="trial" data={trialData} />);
      } else {
        bottomRow.push(<TrialChart key="trial" data={trialData} />);
      }
    }

    return (
      <div className="space-y-6">
        <div className={`grid gap-6 ${topRow.length === 1 ? 'grid-cols-2' : 'grid-cols-2'}`}>
          {topRow}
        </div>
        {bottomRow.length > 0 && (
          <div className={`grid gap-6 ${bottomRow.length === 1 ? 'grid-cols-2' : 'grid-cols-2'}`}>
            {bottomRow}
          </div>
        )}
      </div>
    );
  };

  return renderCharts();
}