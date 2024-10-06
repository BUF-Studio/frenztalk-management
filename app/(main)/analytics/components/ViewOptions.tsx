"use client"

import { Button } from "@/app/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem
} from "@/app/components/ui/dropdown-menu"
import { EyeIcon } from "lucide-react"

export interface ShowGraphs {
  totalUser: boolean
  totalHours: boolean
  grossProfit: boolean
  trialHours: boolean
}

interface ViewOptionsProps {
  showGraphs: ShowGraphs
  setShowGraphs: React.Dispatch<React.SetStateAction<ShowGraphs>>
}

export function ViewOptions({ showGraphs, setShowGraphs }: ViewOptionsProps) {
  const toggleGraph = (key: keyof ShowGraphs) => {
    setShowGraphs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <EyeIcon className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(showGraphs) as Array<keyof ShowGraphs>).map((key) => (
          <DropdownMenuCheckboxItem
            key={key}
            checked={showGraphs[key]}
            onCheckedChange={() => toggleGraph(key)}
          >
            {key.charAt(0).toUpperCase() + key.replace(/([A-Z])/g, ' $1').trim().slice(1)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}