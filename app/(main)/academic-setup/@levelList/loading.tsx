import type React from 'react';

const LevelListLoadingSkeleton: React.FC = () => {
  // Create an array of fake levels for the skeleton
  const skeletonLevels = Array(5).fill(null).map((_, i) => `skeleton-level-${i}`);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-6 flex flex-col h-full mx-auto flex-1 animate-pulse">
      <div className="flex flex-row justify-between mb-4">
        <div className="flex-shrink-0">
          <div className="h-8 w-48 bg-gray-200 dark:bg-neutral-700 rounded mb-2"/>
          <div className="h-4 w-64 bg-gray-200 dark:bg-neutral-700 rounded"/>
        </div>
        <div className="h-10 w-32 bg-gray-200 dark:bg-neutral-700 rounded"/>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4">
        {skeletonLevels.map((key) => (
          <div key={key} className="mb-4 last:mb-0 border border-gray-300 dark:border-neutral-600 rounded">
            <div className="flex flex-row w-full items-center justify-between p-4 bg-gray-100 dark:bg-neutral-800 rounded-t">
              <div className="flex flex-row items-center">
                <div className="w-6 h-6 bg-gray-300 dark:bg-neutral-600 rounded mr-2"/>
                <div className="h-6 w-32 bg-gray-300 dark:bg-neutral-600 rounded"/>
              </div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-300 dark:bg-neutral-600 rounded"/>
                <div className="w-8 h-8 bg-gray-300 dark:bg-neutral-600 rounded"/>
              </div>
            </div>
            <div className="p-4 dark:bg-neutral-800">
              {['student', 'tutor'].map((type) => (
                <div key={`${key}-${type}`} className="mb-2 last:mb-0 border border-gray-200 dark:border-neutral-700 rounded p-4">
                  <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-700 rounded mb-2"/>
                  <div className="space-y-2">
                    {['USD', 'GBP', 'MYR'].map((currency) => (
                      <div key={`${key}-${type}-${currency}`} className="h-8 bg-gray-200 dark:bg-neutral-700 rounded"/>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LevelListLoadingSkeleton;