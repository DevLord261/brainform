"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsePieChart } from "./response-pie-chart"
import { ResponseBarChart } from "./response-bar-chart"
import { TextResponsesList } from "./text-responses-list"
import { DailySubmissionsChart } from "./daily-submissions-chart"
import { useState, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SummaryChartCard({ chartInfo }: { chartInfo: any }) {
  const { type, questionLabel, data, totalResponses } = chartInfo
  const [selectedMonth, setSelectedMonth] = useState<string>("all")

  // Generate complete month data with all days
  const generateCompleteMonthData = (originalData: any[], monthIndex: number) => {
    const currentYear = new Date().getFullYear()
    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate()
    const completeData = []

    // Create data for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      const existingData = originalData.find((item: any) => item.name === dateStr)

      completeData.push({
        name: dateStr,
        value: existingData ? existingData.value : 0,
      })
    }

    return completeData
  }

  // Filter and complete data based on selected month for line charts
  const filteredData = useMemo(() => {
    if (type !== "line") return data

    if (selectedMonth === "all") {
      return data
    }

    const selectedMonthIndex = Number.parseInt(selectedMonth)
    return generateCompleteMonthData(data, selectedMonthIndex)
  }, [data, selectedMonth, type])

  // Generate month options
  const monthOptions = [
    { value: "all", label: "All Months" },
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ]

  const renderChart = () => {
    switch (type) {
      case "pie":
        return <ResponsePieChart data={data} />
      case "bar":
        return <ResponseBarChart data={data} />
      case "line":
        return <DailySubmissionsChart data={filteredData} />
      case "list":
        return <TextResponsesList data={data} />
      default:
        return <p>Unsupported chart type</p>
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-semibold">{questionLabel}</CardTitle>
            <CardDescription>{totalResponses} responses</CardDescription>
          </div>
          {type === "line" && (
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {monthOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">{renderChart()}</CardContent>
    </Card>
  )
}
