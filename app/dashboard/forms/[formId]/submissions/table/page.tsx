"use client";

export const dynamic = "force-dynamic";

import { memoryStore } from "@/lib/memory-store";
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
import { use } from "react";

export default function SubmissionsTablePage({
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

  const headers = form.fields
    .filter((field) => field.type !== "hidden")
    .map((field) => ({
      key: field.extraAttributes?.dbColumnName || field.label,
      label: field.label,
    }));

  const handleExport = () => {
    const dataToExport = submissions.map((submission) => {
      const row: Record<string, string> = {
        "Submission Date": submission.createdAt.toLocaleString(),
      };
      headers.forEach((header) => {
        row[header.label] = String(submission.data[header.key] || "");
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
                submissions.map((submission) => (
                  <TableRow key={submission.id}>
                    <TableCell>
                      {submission.createdAt.toLocaleString()}
                    </TableCell>
                    {headers.map((header) => (
                      <TableCell key={header.key}>
                        {String(submission.data[header.key] || "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
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
