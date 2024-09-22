"use client";

import MonthCalendar from "@/app/components/dashboard/Calendar";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import TuitionList from "../../components/main/tuitionList";
import { AddTuitionModalDialog } from "./tuitionModalDialog";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import UnpaidWarningList from "@/app/components/main/unpaidWarningList";
import { useInvoices } from "@/lib/context/collection/invoiceContext";

export default function TuitionPage() {
  const { tuitions } = useTuitions();
  const router = useRouter();
  // const { tuition, setTuition } = useTuitionPage();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { unpaidInvoices } = useInvoices();

  // useEffect(() => {
  //   fetchTuitions()
  // }, [])

  // async function fetchTuitions(page = 1, pageSize = 10) {
  //   const response = await fetch(`/api/tuitions?page=${page}&pageSize=${pageSize}`)
  //   const data = await response.json()
  //   console.log(data)
  //   setTuitions(data)
  // }

  const addTuition = () => {
    // setTuition(null);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-1 h-full w-full flex-row gap-4 justify-start items-start overflow-hidden">
      <div className="flex flex-col flex-1 overflow-y-auto h-full">
        {/* Calendar section */}
        <div className="flex flex-col flex-1 h-full">
          <MonthCalendar
            events={tuitions}
            onDateSelect={(date) => setSelectedDate(date)}
          />
          <div className="flex flex-1 flex-grow" />
        </div>
        {/* Unpaid classes section */}
        <div className="flex flex-col flex-1 h-full">
          <h1 className="text-lg font-normal my-2">Unpaid Invoices</h1>
          <div className="flex-1">
            <UnpaidWarningList unpaidInvoiceList={unpaidInvoices} />
          </div>
        </div>
      </div>
      <div className="w-[460px] h-full flex-shrink-0 flex flex-col overflow-y-auto">
        <div className="flex flex-row justify-between items-center mb-2">
          <h1 className="text-lg font-normal">Classes</h1>
          <button
            className="flex flex-row items-center px-4 py-2  bg-red-800 text-white text-sm rounded-md font-semibold hover:bg-red-800/[0.8] hover:shadow-lg"
            type="button"
            onClick={addTuition}
          >
            <Plus size={16} strokeWidth={3} className="mr-1" />
            Add Class
          </button>
        </div>

        <TuitionList tuitions={tuitions} />
      </div>
      <AddTuitionModalDialog
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
        tuition={null}
        setTuition={() => {}}
      />
    </div>
  );
}
