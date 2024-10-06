"use client";

import { UserDistributionChart } from "./charts/user-chart";
import { useFilter } from "../hooks/FilterContext";
import { TrialChart } from "./charts/trial-chart";
import GrossProfitChart from "./charts/gross-profit-chart";
import TotalClassChart from "./charts/total-class-chart";
import { useStudents } from "@/lib/context/collection/studentsContext";
import { useTutors } from "@/lib/context/collection/tutorContext";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import { useInvoices } from "@/lib/context/collection/invoiceContext";
import { usePayments } from "@/lib/context/collection/paymentContext";
import { useEffect, useMemo } from "react";
import { InvoiceStatus } from "@/lib/models/invoiceStatus";

export default function GraphGrid() {
  const { showGraphs, selectedMonth } = useFilter();
  const { students } = useStudents();
  const { tutors } = useTutors();
  const { tuitions } = useTuitions();
  const { invoices } = useInvoices();
  const { payments } = usePayments();
  
// Tutor and student counts
  const studentCount = students.length;
  const tutorCount = tutors.length;

  // Total class count for the last 5 months
  const totalClassData = useMemo(() => {
    const selectedDate = new Date(selectedMonth);
    // Include the full selected month by setting the date to the last day of the month
    selectedDate.setMonth(selectedDate.getMonth() + 1, 0);
    const fiveMonthsAgo = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 5, 1);
    
    const filteredTuitions = tuitions.filter(tuition => {
      const tuitionDate = new Date(tuition.startTime);
      return tuitionDate >= fiveMonthsAgo && tuitionDate <= selectedDate;
    });

    const monthlyTotals: { [key: string]: number } = {};
    for (let i = 0; i <= 5; i++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - i, 1);
      const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyTotals[monthKey] = 0;
    }

    filteredTuitions.forEach(tuition => {
      const tuitionDate = new Date(tuition.startTime);
      const monthKey = tuitionDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      if (monthKey in monthlyTotals) {
        monthlyTotals[monthKey] += 1;
      }
    });

    return Object.entries(monthlyTotals).reverse().map(([month, totalClasses]) => ({
      month,
      totalClasses
    }));
  }, [tuitions, selectedMonth]);
  
  const grossProfitData = useMemo(() => {
    const selectedDate = new Date(selectedMonth);
    selectedDate.setMonth(selectedDate.getMonth() + 1, 0);
    const sixMonthsAgo = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 5, 1);
    
    const monthlyGrossProfit: { [key: string]: number } = {};
    for (let i = 0; i <= 5; i++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - i, 1);
      const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyGrossProfit[monthKey] = 0;
    }

    invoices.forEach(invoice => {
      if (invoice.status === InvoiceStatus.PAID) {
        const invoiceDate = new Date(invoice.startDateTime);
        if (invoiceDate >= sixMonthsAgo && invoiceDate <= selectedDate) {
          const monthKey = invoiceDate.toLocaleString('default', { month: 'short', year: 'numeric' });
          if (monthKey in monthlyGrossProfit) {
            monthlyGrossProfit[monthKey] += invoice.rate;
          }
        }
      }
    });

    payments.forEach(payment => {
      if (payment.status === InvoiceStatus.PAID) {
        const paymentDate = new Date(payment.startDateTime);
        if (paymentDate >= sixMonthsAgo && paymentDate <= selectedDate) {
          const monthKey = paymentDate.toLocaleString('default', { month: 'short', year: 'numeric' });
          if (monthKey in monthlyGrossProfit) {
            monthlyGrossProfit[monthKey] -= payment.rate;
          }
        }
      }
    });

    return Object.entries(monthlyGrossProfit).reverse().map(([month, grossProfit]) => ({
      month,
      grossProfit
    }));
  }, [invoices, payments, selectedMonth]);

  // Trial and non-trial hours for the last 6 months
  // Trial and non-trial hours for the last 6 months
  const trialData = useMemo(() => {
    const selectedDate = new Date(selectedMonth);
    selectedDate.setMonth(selectedDate.getMonth() + 1, 0);
    const sixMonthsAgo = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 5, 1);
    
    const monthlyTrialData: { [key: string]: { trial: number; nonTrial: number } } = {};
    for (let i = 0; i <= 5; i++) {
      const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - i, 1);
      const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      monthlyTrialData[monthKey] = { trial: 0, nonTrial: 0 };
    }

    tuitions.forEach(tuition => {
      const tuitionDate = new Date(tuition.startTime);
      if (tuitionDate >= sixMonthsAgo && tuitionDate <= selectedDate) {
        const monthKey = tuitionDate.toLocaleString('default', { month: 'short', year: 'numeric' });
        if (monthKey in monthlyTrialData) {
          if (tuition.trial) {
            monthlyTrialData[monthKey].trial += 1;
          } else {
            monthlyTrialData[monthKey].nonTrial += 1;
          }
        }
      }
    });

    return Object.entries(monthlyTrialData).reverse().map(([month, data]) => ({
      month,
      trial: data.trial,
      nonTrial: data.nonTrial
    }));
  }, [tuitions, selectedMonth]);

  const renderCharts = () => {
    const topRow = [];
    const bottomRow = [];

    if (showGraphs.totalUser) {
      topRow.push(
        <UserDistributionChart
          key="user"
          tutorCount={tutorCount}
          studentCount={studentCount}
        />
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
        topRow.push(<TrialChart key="trial" chartData={trialData} />);
      } else {
        bottomRow.push(<TrialChart key="trial" chartData={trialData} />);
      }
    }

    return (
      <div className="space-y-6">
        <div
          className={`grid gap-6 ${
            topRow.length === 1 ? "grid-cols-2" : "grid-cols-2"
          }`}
        >
          {topRow}
        </div>
        {bottomRow.length > 0 && (
          <div
            className={`grid gap-6 ${
              bottomRow.length === 1 ? "grid-cols-2" : "grid-cols-2"
            }`}
          >
            {bottomRow}
          </div>
        )}
      </div>
    );
  };

  return renderCharts();
}
