"use client"

import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart"

export const description = "A radial chart showing user distribution"

const chartConfig = {
  tutors: {
    label: "Tutors",
    color: "hsl(var(--chart-1))",
  },
  students: {
    label: "Students",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

interface UserDistributionChartProps {
  tutorCount: number;
  studentCount: number;
}

export function UserDistributionChart({ tutorCount, studentCount }: UserDistributionChartProps) {
  const chartData = [{ tutors: tutorCount, students: studentCount }]
  const totalUsers = tutorCount + studentCount

  return (
    <Card>
      <CardHeader>
        <CardTitle>User</CardTitle>
        <CardDescription>Tutors vs Students</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalUsers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Total Users
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="tutors"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-tutors)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="students"
              fill="var(--color-students)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm items-center">
        <div className="flex gap-2 font-medium leading-none">
          Tutors: {tutorCount} | Students: {studentCount}
        </div>
        <div className="text-muted-foreground text-center">
          Showing current user distribution
        </div>
      </CardFooter>
    </Card>
  )
}