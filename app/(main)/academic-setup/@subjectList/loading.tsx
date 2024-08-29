import type React from "react";

const Loading: React.FC = () => {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6 flex flex-col h-full mx-auto flex-1 animate-pulse">
      <div className="mb-6 flex-shrink-0">
        <div className="h-8 w-32 bg-gray-200 dark:bg-neutral-700 rounded mb-2" />
        <div className="h-4 w-64 bg-gray-200 dark:bg-neutral-700 rounded" />
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 mb-6 p-1">
        {[...Array(5)].map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={`subject-skeleton-${i}`}
            className="flex items-center space-x-2"
          >
            <div className="flex-grow h-10 bg-gray-200 dark:bg-neutral-700 rounded-md" />
            <div className="flex space-x-1">
              <div className="w-10 h-10 bg-gray-300 dark:bg-neutral-600 rounded-md" />
              <div className="w-10 h-10 bg-gray-300 dark:bg-neutral-600 rounded-md" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2 mt-auto">
        <div className="flex-grow h-10 bg-gray-200 dark:bg-neutral-700 rounded-md" />
        <div className="w-32 h-10 bg-blue-200 dark:bg-blue-900 rounded-md" />
      </div>
    </div>
  );
};

export default Loading;
