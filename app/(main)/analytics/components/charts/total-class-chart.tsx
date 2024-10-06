"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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

const chartConfig = {
  totalClasses: {
    label: "Total Class",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

interface TotalClassChartProps {
    chartData: { month: string; totalClasses: number }[]
}

export default function TotalClassChart({ chartData }: TotalClassChartProps) {
  const sortedData = [...chartData].sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  const dateRange = `${sortedData[0].month} - ${sortedData[sortedData.length - 1].month}`;

  const calculateTrend = () => {
    if (sortedData.length < 2) return { percentage: 0, isUp: true };
    const lastMonth = sortedData[sortedData.length - 1].totalClasses;
    const previousMonth = sortedData[sortedData.length - 2].totalClasses;
    const difference = lastMonth - previousMonth;
    const percentage = (difference / previousMonth) * 100;
    return { percentage: Math.abs(percentage), isUp: percentage >= 0 };
  };

  const { percentage, isUp } = calculateTrend();

  return (
    <Card >
      <CardHeader>
        <CardTitle>Total Hour</CardTitle>
        <CardDescription>{dateRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={sortedData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="totalClasses" fill="var(--color-totalClasses)" radius={[8, 8, 0, 0]}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium">
          {isUp ? "Trending up" : "Trending down"} by {percentage.toFixed(1)}% this month 
          {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        </div>
        <div className="text-muted-foreground">
          Showing total hours for the last {sortedData.length} months
        </div>
      </CardFooter>
    </Card>
  )
}