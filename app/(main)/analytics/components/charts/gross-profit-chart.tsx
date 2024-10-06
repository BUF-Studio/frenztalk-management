"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart";

const chartConfig = {
  grossProfit: {
    label: "RM",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface GrossProfitChartProps {
  chartData: { month: string; grossProfit: number }[];
}

export default function GrossProfitChart({ chartData }: GrossProfitChartProps) {
  const sortedData = [...chartData].sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  const dateRange = `${sortedData[0].month} - ${sortedData[sortedData.length - 1].month}`;

  const calculateTrend = () => {
    if (sortedData.length < 2) return { percentage: 0, isUp: true };
    const lastMonth = sortedData[sortedData.length - 1].grossProfit;
    const previousMonth = sortedData[sortedData.length - 2].grossProfit;
    const difference = lastMonth - previousMonth;
    const percentage = (difference / previousMonth) * 100;
    return { percentage: Math.abs(percentage), isUp: percentage >= 0 };
  };

  const { percentage, isUp } = calculateTrend();

  return (
    <Card >
      <CardHeader>
        <CardTitle>Gross Profit</CardTitle>
        <CardDescription>{dateRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={sortedData}
            margin={{
              top: 20,
              right: 20,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              stroke="hsl(var(--foreground))"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `RM${value}`}
              stroke="hsl(var(--foreground))"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              type="monotone"
              dataKey="grossProfit"
              stroke="var(--color-grossProfit)"
              strokeWidth={2}
              dot={{
                r: 4,
                fill: "var(--color-grossProfit)",
                stroke: "var(--background)",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "var(--color-grossProfit)",
                stroke: "var(--background)",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
      <div className="flex gap-2 font-medium">
          {isUp ? "Trending up" : "Trending down"} by {percentage.toFixed(1)}% this month 
          {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total hours for the last {sortedData.length} months
        </div>
      </CardFooter>
    </Card>
  );
}
