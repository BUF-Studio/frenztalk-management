// AnalyticsDashboard.tsx
import { Suspense } from "react";
import { FilterProvider } from "./hooks/FilterContext";
import AnalyticHeader from "./components/AnalyticHeader";
import AnalyticContent from "./components/AnalyticContent";

export default function AnalyticsDashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <AnalyticHeader />
      <Suspense fallback={<div>Loading...</div>}>
        <FilterProvider>
          <AnalyticContent />
        </FilterProvider>
      </Suspense>
    </div>
  );
}
