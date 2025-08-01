"use client";

export const dynamic = "force-dynamic";

import { memoryStore } from "@/lib/memory-store";
import { notFound } from "next/navigation";
import type { FormField } from "@/lib/types";
import type { Submission } from "@/lib/memory-store";
import { SummaryChartCard } from "@/components/submissions/summary-chart-card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { use } from "react";

// Helper function to process data
const processSubmissions = (fields: FormField[], submissions: Submission[]) => {
  const dailyCounts = submissions.reduce(
    (acc, s) => {
      const date = new Date(s.createdAt).toLocaleDateString("en-CA"); // YYYY-MM-DD format
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const dailyData = Object.entries(dailyCounts)
    .map(([date, count]) => ({ name: date, value: count }))
    .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

  const questionCharts = fields
    .filter(
      (field) => !["hidden", "password", "signature"].includes(field.type),
    )
    .map((field) => {
      const questionLabel = field.label;
      const dbColumnName = field.extraAttributes?.dbColumnName || field.label;
      const responses = submissions
        .map((s) => s.data[dbColumnName])
        .filter(Boolean);

      if (["select", "radio", "checkbox"].includes(field.type)) {
        const counts = responses.reduce(
          (acc, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        const chartData = Object.entries(counts).map(([name, value]) => ({
          name,
          value,
          fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
        }));
        return {
          type: "pie",
          questionLabel,
          data: chartData,
          totalResponses: responses.length,
        };
      }

      if (["checkbox-group"].includes(field.type)) {
        const allChoices = responses.flatMap((r) =>
          Array.isArray(r) ? r : String(r).split(","),
        );
        const counts = allChoices.reduce(
          (acc, val) => {
            acc[val] = (acc[val] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        const chartData = Object.entries(counts).map(([name, value]) => ({
          name,
          value,
        }));
        return {
          type: "bar",
          questionLabel,
          data: chartData,
          totalResponses: responses.length,
        };
      }

      if (field.type === "rating") {
        const counts = responses.reduce(
          (acc, val) => {
            const rating = String(val);
            acc[rating] = (acc[rating] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        const maxStars = field.extraAttributes?.maxStars || 5;
        const chartData = Array.from({ length: maxStars }, (_, i) => {
          const star = String(i + 1);
          return {
            name: `${star} Star${i > 0 ? "s" : ""}`,
            value: counts[star] || 0,
          };
        });
        return {
          type: "bar",
          questionLabel,
          data: chartData,
          totalResponses: responses.length,
        };
      }

      if (
        [
          "text",
          "textarea",
          "email",
          "number",
          "date",
          "time",
          "color",
        ].includes(field.type)
      ) {
        return {
          type: "list",
          questionLabel,
          data: responses,
          totalResponses: responses.length,
        };
      }

      return null;
    })
    .filter(Boolean);

  return [
    {
      type: "line",
      questionLabel: "Daily Submissions",
      data: dailyData,
      totalResponses: submissions.length,
    },
    ...questionCharts,
  ];
};

export default function SummaryPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = use(params);
  const form = memoryStore.getForm(formId);
  const submissions = memoryStore.getSubmissions(formId);

  if (!form) {
    notFound();
  }

  const chartData = processSubmissions(form.fields, submissions);

  if (submissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          No submissions yet for this form.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4 print-hide">
        <Button variant="outline" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Print Summary
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 summary-page-grid">
        {chartData.map((data, index) => {
          if (data?.type === "line") {
            return (
              <div key={index} className="md:col-span-2 lg:col-span-3">
                <SummaryChartCard chartInfo={data} />
              </div>
            );
          }
          return <SummaryChartCard key={index} chartInfo={data} />;
        })}
      </div>
    </div>
  );
}
