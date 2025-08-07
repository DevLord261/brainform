"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Form } from "@/lib/types";
import type { Submission } from "@/lib/memory-store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Label } from "@/components/ui/label";

export function IndividualResponseViewer({
  form,
  submissions,
}: {
  form: Form;
  submissions: Submission[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentIndex = Number(searchParams.get("index") || "0");
  const currentSubmission = submissions[currentIndex];

  const navigate = (newIndex: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("index", String(newIndex));
    router.push(`${pathname}?${params.toString()}`);
  };

  if (!currentSubmission) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Invalid submission index.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Individual Response</CardTitle>
            <CardDescription>
              Submitted on{" "}
              {new Date(currentSubmission.created_at).toLocaleString()}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {submissions.length}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(currentIndex - 1)}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(currentIndex + 1)}
              disabled={currentIndex === submissions.length - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {form.fields
          .filter((field) => !["hidden", "password"].includes(field.type))
          .map((field) => {
            const dbColumnName =
              field.extraAttributes?.dbColumnName || field.label;
            const answer = currentSubmission.data[dbColumnName];
            return (
              <div key={field.id} className="p-4 border rounded-md bg-muted/20">
                <Label className="font-semibold text-base">{field.label}</Label>
                <div className="mt-2 text-foreground">
                  {answer ? (
                    String(answer)
                  ) : (
                    <span className="text-muted-foreground italic">
                      No answer
                    </span>
                  )}
                </div>
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
}
