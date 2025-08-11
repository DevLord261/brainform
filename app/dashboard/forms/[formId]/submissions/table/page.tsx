"use client";

export const dynamic = "force-dynamic";

import { FormWithId } from "@/lib/memory-store";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import { Key, use, useEffect, useState } from "react";
import { FormField, Submittions } from "@/lib/types";

export default function SubmissionsTablePage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = use(params);
  // const submissions = memoryStore.getSubmissions(formId);
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
  }, [formId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading form data...</p>
      </div>
    );
  }
  if (error || !form || !submissions) {
    notFound();
  }
  const headers = form.fields
    .filter((field: FormField) => field.type !== "hidden")
    .map((field: FormField) => ({
      key: field.id as Key,
      label: field.label,
    }));

  const handleExport = () => {
    const dataToExport = submissions.map((submission) => {
      const row: Record<string, string> = {
        "Submission Date": submission.submitted_at.toLocaleString(),
      };
      headers.forEach((header) => {
        row[header.label] = String(
          submission.submitions[header.key.toString()] || "",
        );
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Submissions");
    XLSX.writeFile(
      workbook,
      `${form.title.replace(/ /g, "_")}_submissions.xlsx`,
    );
  };

  return (
    <Card className="table-view-page">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>All Submissions</CardTitle>
            <CardDescription>
              You have received{" "}
              <Badge variant="secondary">{submissions.length}</Badge>{" "}
              submissions for this form.
            </CardDescription>
          </div>
          <div className="flex gap-2 print-hide">
            <Button variant="outline" onClick={handleExport}>
              <FileDown className="mr-2 h-4 w-4" />
              Export as Excel
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Print Table
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Submission Date</TableHead>
                {headers.map((header) => (
                  <TableHead key={header.key}>{header.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.length > 0 ? (
                submissions.map((submission) => {
                  if (
                    typeof submission.submitions === "string" &&
                    submission.submitions.trim().startsWith("{")
                  ) {
                    try {
                      submission.submitions = JSON.parse(submission.submitions);
                    } catch {
                      submission.submitions = {};
                    }
                  } else if (typeof submission.submitions === "object") {
                    submission.submitions = submission.submitions;
                  } else {
                    submission.submitions = {};
                  }
                  return (
                    <TableRow key={submission.id}>
                      <TableCell>
                        {submission.submitted_at.toLocaleString()}
                      </TableCell>
                      {headers.map((header) => (
                        <TableCell key={header.key}>
                          {String(
                            submission.submitions[header.key.toString()] || "",
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={headers.length + 1}
                    className="h-24 text-center"
                  >
                    No submissions yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
