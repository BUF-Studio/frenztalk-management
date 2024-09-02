// loading.tsx
import type React from "react";

const Loading: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="flex flex-row justify-between mb-2">
        <div
          className="flex items-center h-10 mb-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded"
        />
        <button
          type="button"
          className="flex items-center h-10 mb-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded"
        />
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-grow">
          <div className="flex justify-between items-center h-10 mb-2 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="flex justify-between items-center h-10 mb-2 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="flex justify-between items-center h-10 mb-2 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>
      </div>
    </div>
  );
};

export default Loading;
