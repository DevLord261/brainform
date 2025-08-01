import { memoryStore } from "@/lib/memory-store";
import { notFound, redirect } from "next/navigation";
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
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function SubmissionsPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const form = memoryStore.getForm(formId);
  const submissions = memoryStore.getSubmissions(formId);

  if (!form) {
    notFound();
  }

  const headers = form.fields
    .filter((field) => field.type !== "hidden") // Don't show hidden fields as columns
    .map((field) => ({
      key: field.extraAttributes?.dbColumnName || field.label,
      label: field.label,
    }));

  // Redirect to summary page
  redirect(`/dashboard/forms/${formId}/submissions/summary`);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Submissions</h1>
          <p className="text-muted-foreground">for &quot;{form.title}&quot;</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Received Data</CardTitle>
          <CardDescription>
            You have received{" "}
            <Badge variant="secondary">{submissions.length}</Badge> submissions
            for this form.
          </CardDescription>
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
    </div>
  );
}
