"use client"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

export function ResponseBarChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ChartContainer config={{}} className="min-h-[250px] w-full">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
          <YAxis allowDecimals={false} />
          <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="value" fill="hsl(var(--primary))" radius={8} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
