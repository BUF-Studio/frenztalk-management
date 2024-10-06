"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
  nonTrial: {
    label: "Paid",
    color: "hsl(var(--chart-2))",
  },
  trial: {
    label: "Trial",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface TrialChartProps {
  chartData: { month: string; trial: number; nonTrial: number }[];
}

export function TrialChart({ chartData }: TrialChartProps) {
  const sortedData = [...chartData].sort(
    (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
  );
  const dateRange = `${sortedData[0].month} - ${
    sortedData[sortedData.length - 1].month
  }`;

  const calculateTrend = () => {
    if (sortedData.length < 2) return { percentage: 0, isUp: true };
    const lastMonth = sortedData[sortedData.length - 1].nonTrial;
    const previousMonth = sortedData[sortedData.length - 2].nonTrial;
    const difference = lastMonth - previousMonth;
    const percentage = (difference / previousMonth) * 100;
    return { percentage: Math.abs(percentage), isUp: percentage >= 0 };
  };

  const { percentage, isUp } = calculateTrend();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trial vs Paid Classes</CardTitle>
        <CardDescription>
          Showing total classes for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillTrial" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-trial)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-trial)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillNonTrial" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-nonTrial)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-nonTrial)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="trial"
              type="natural"
              fill="url(#fillTrial)"
              fillOpacity={0.4}
              stroke="var(--color-trial)"
              stackId="a"
            />
            <Area
              dataKey="nonTrial"
              type="natural"
              fill="url(#fillNonTrial)"
              fillOpacity={0.4}
              stroke="var(--color-nonTrial)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex gap-2 font-medium">
              {`
              Non trial class
               ${isUp ? "trending up" : "trending down"} by ${" "}
              ${percentage.toFixed(1)}% this month
              `}
              {isUp ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              {dateRange}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
