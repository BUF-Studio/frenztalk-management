// loading.tsx
import type React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="animate-pulse">
      <button type="button" className="flex items-center h-10 mb-4 bg-neutral-200 dark:bg-neutral-800 rounded"/>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-grow">
          <div className="bg-neutral-200 dark:bg-neutral-800 h-28 p-6 mb-4 rounded-lg grid grid-cols-2 divide-x divide-neutral-200 dark:divide-neutral-700"/>
          <div className="flex justify-between items-center h-10 mb-2 bg-neutral-200 dark:bg-neutral-800 rounded"/>

          {/* Skeleton for StudentTuitionList */}
          <div className="h-40 bg-neutral-200 dark:bg-neutral-800 rounded"/>
        </div>

        {/* Right Side */}
        <div className="lg:w-[300px] flex-shrink-0 flex flex-col gap-4">
          {/* Skeleton for MonthCalendar */}
          <div className="h-40 bg-neutral-200 dark:bg-neutral-800 rounded"/>

          {/* Skeleton for StudentTutorList */}
          <div className="h-40 bg-neutral-200 dark:bg-neutral-800 rounded"/>

          {/* Skeleton for StudentInvoiceList */}
          <div className="flex flex-1 h-full bg-neutral-200 dark:bg-neutral-800 rounded"/>
        </div>
      </div>
    </div>
  );
};

export default Loading;
