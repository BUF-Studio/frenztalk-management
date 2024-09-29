"use client";

import { Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import MonthCalendar from "@/app/components/dashboard/Calendar";
import TuitionList from "@/app/components/main/tuitionList";
import { useTuitions } from "@/lib/context/collection/tuitionContext";
import UnpaidWarningList from "@/app/components/main/unpaidWarningList";
import { useInvoices } from "@/lib/context/collection/invoiceContext";
import { Button } from "@/app/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";

export default function TuitionPage() {
  const { tuitions } = useTuitions();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { unpaidInvoices } = useInvoices();
  const [currentTime] = useState(() => new Date().getTime());

  const handleAddTuition = () => {
    router.push("/tuitions/add");
  };

  const { presentTuitions, pastTuitions } = useMemo(() => {
    const present = [];
    const past = [];

    for (const tuition of tuitions) {
      const startTime = new Date(tuition.startTime).getTime();
      const endTime = startTime + tuition.duration * 60000; // Assuming duration is in minutes

      if (endTime <= currentTime) {
        past.push(tuition);
      } else {
        present.push(tuition);
      }
    }

    return { presentTuitions: present, pastTuitions: past };
  }, [tuitions, currentTime]);

  return (
    <div className="dark:transparent dark:text-neutral-100 h-full flex flex-col">
      <div className="flex flex-row justify-between items-center mb-2">
        <h1 className="text-xl font-bold">Home</h1>
      </div>
      {/* Main Section */}
      <div className="flex flex-col lg:flex-row gap-4 flex-grow overflow-hidden">
        {/* Left Side */}
        <div className="flex-grow overflow-hidden flex flex-col">
          <Tabs defaultValue="present" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="present">Present</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            <div className="flex-grow overflow-hidden">
              <TabsContent value="present" className="h-full overflow-y-auto">
                <TuitionList tuitions={presentTuitions} filter={selectedDate} />
              </TabsContent>
              <TabsContent value="past" className="h-full overflow-y-auto">
                <TuitionList tuitions={pastTuitions} filter={selectedDate} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Right Side */}
        <div className="lg:w-[300px] flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
          <div className="flex flex-row justify-between items-center">
            {selectedDate ? (
              <Button
                variant={"secondary"}
                onClick={() => setSelectedDate(null)}
              >
                {selectedDate.toDateString()}
                <X className="ml-2" size={16} strokeWidth={3} />
              </Button>
            ) : (
              <Button
                variant={"outline"}
                onClick={() => setSelectedDate(null)}
                disabled
              >
                No Filter
              </Button>
            )}
            <Button variant={"default"} onClick={handleAddTuition}>
              <Plus size={16} strokeWidth={3} className="mr-1" />
              Add Class
            </Button>
          </div>
          <div>
            <MonthCalendar
              events={tuitions}
              onDateSelect={(date) => setSelectedDate(date)}
              onResetDateSelect={selectedDate === null}
            />
          </div>
          <div className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold dark:text-neutral-200">
                Unpaid Invoices
              </h2>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              <UnpaidWarningList
                unpaidInvoiceList={unpaidInvoices}
                tuitions={tuitions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}