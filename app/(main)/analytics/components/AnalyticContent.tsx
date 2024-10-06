// components/DashboardContent.tsx
import { Suspense } from 'react'
import FilterControls from './FilterControls'
import GraphGrid from './GraphGrid'

export default function DashboardContent() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <FilterControls />
      <Suspense fallback={<div>Loading graphs...</div>}>
        <GraphGrid />
      </Suspense>
    </main>
  )
}