"use client";

export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import type { FormField, Submittions } from "@/lib/types";
import type { FormWithId } from "@/lib/memory-store";
import { SummaryChartCard } from "@/components/submissions/summary-chart-card";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { use, useEffect, useState } from "react";

// Helper function to process data
const processSubmissions = (
  fields: FormField[],
  submissions: Submittions[],
) => {
  const dailyCounts = submissions.reduce(
    (acc, s) => {
      const date = new Date(s.submitted_at).toLocaleDateString("en-CA"); // YYYY-MM-DD format
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
      const dbColumnName = (field.extraAttributes?.dbColumnName ||
        field.label) as string;
      const responses = submissions
        .map((s) => {
          const submited = JSON.parse(s.submitions as unknown as string);
          // s.submitions[dbColumnName]
          return submited[field.id];
        })
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
        const chartData = Array.from({ length: maxStars as number }, (_, i) => {
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
  const [form, setform] = useState<FormWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submissions, setSubmission] = useState<Submittions[]>();

  useEffect(() => {
    const formapi = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/getform?formId=${formId}`,
          {
            method: "GET",
          },
        );
        if (!res.ok) {
          setError(true);
          return;
        }
        const data = (await res.json()) as FormWithId;
        setform(data);
      } catch (e) {
        console.error("error fetching form:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    const getform = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/submittions?formId=${formId}`,
        );
        if (!res.ok) {
          setError(true);
          return;
        }
        const json = (await res.json()) as Submittions[];
        setSubmission(json);
      } catch (e) {
        console.error(e);
      }
    };
    getform();
    formapi();
  }, [formId, setSubmission]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading form data...</p>
      </div>
    );
  }
  if (error || !form) {
    notFound();
  }
  if (submissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          No submissions yet for this form.
        </p>
      </div>
    );
  }
  const chartData = processSubmissions(form.fields as FormField[], submissions);
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
          if (data != null)
            return <SummaryChartCard key={index} chartInfo={data} />;
        })}
      </div>
    </div>
  );
}
