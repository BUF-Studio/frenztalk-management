"use client";

import { TrendingUp } from "lucide-react";
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
    label: "GP",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface GrossProfitChartProps {
  chartData: { month: string; grossProfit: number }[];
}

export default function GrossProfitChart({ chartData }: GrossProfitChartProps) {
  return (
    <Card >
      <CardHeader>
        <CardTitle>Gross Profit</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
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
              tickFormatter={(value) => `$${value / 1000}k`}
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
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 18.75% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing gross profit for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
