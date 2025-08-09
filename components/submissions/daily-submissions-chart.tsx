"use client";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartContainer } from "@/components/ui/chart";

export function DailySubmissionsChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  // Format X-axis labels to show day numbers
  const formatXAxisLabel = (tickItem: string) => {
    const date = new Date(tickItem);
    return date.getDate().toString();
  };

  const yMax = Math.max(...data.map((d) => d.value), 0);
  const domainMax = yMax > 0 ? Math.ceil(yMax / 5) * 5 : 5; // Round up to nearest 5, ensure it's at least 5
  const ticks = Array.from({ length: domainMax / 5 + 1 }, (_, i) => i * 5);

  return (
    <ChartContainer config={{}} className="min-h-[250px] w-full">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 20, bottom: 40, left: 30 }}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="2 2"
            stroke="hsl(var(--border))"
            opacity={0.3}
            horizontalPoints={[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50]}
          />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={8}
            axisLine={false}
            interval={0}
            fontSize={11}
            tick={{ fontSize: 11 }}
            tickFormatter={formatXAxisLabel}
          />
          <YAxis
            allowDecimals={false}
            domain={[0, domainMax]}
            ticks={ticks}
            tickCount={ticks.length}
            fontSize={10}
            tick={{ fontSize: 10 }}
          />
          <Tooltip
            cursor={{
              stroke: "hsl(var(--primary))",
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
            content={({ active, payload, label }) => {
              if (label != undefined && active && payload && payload.length) {
                const date = new Date(label).toLocaleDateString("en-US", {
                  weekday: "short",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                });
                return (
                  <div className="bg-background border rounded-lg shadow-lg p-3">
                    <p className="text-sm font-medium">{date}</p>
                    <p className="text-sm text-primary">
                      {payload[0].value} submission
                      {payload[0].value !== 1 ? "s" : ""}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            dataKey="value"
            name="Submissions"
            type="monotone"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 3 }}
            activeDot={{
              r: 5,
              stroke: "hsl(var(--primary))",
              strokeWidth: 2,
              fill: "hsl(var(--background))",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
