"use client"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

export function ResponsePieChart({ data }: { data: { name: string; value: number; fill: string }[] }) {
  return (
    <ChartContainer config={{}} className="min-h-[250px] w-full">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Tooltip content={<ChartTooltipContent hideLabel />} />
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
