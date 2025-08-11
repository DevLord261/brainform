export const dynamic = "force-dynamic";

import { FormWithId, memoryStore } from "@/lib/memory-store";
import { notFound } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField, Submittions } from "@/lib/types";

export default async function QuestionsPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  // const form = memoryStore.getForm(formId);
  const formapi = await fetch(
    `http://localhost:3000/api/getform?formId=${formId}`,
    {
      method: "GET",
    },
  );
  const form = (await formapi.json()) as FormWithId;
  const getsubmissions = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/submittions?formId=${formId}`,
      );
      if (!res.ok) {
        return;
      }
      const json = (await res.json()) as Submittions[];
      return json;
    } catch (e) {
      console.error(e);
    }
  };
  const submissions = await getsubmissions();

  if (!form || !submissions) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Responses by Question</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {form.fields
            .filter(
              (field: FormField) =>
                !["hidden", "password"].includes(field.type),
            )
            .map((field: FormField, index: number) => {
              const dbColumnName = (field.extraAttributes?.dbColumnName ||
                field.label) as string;
              const responses = submissions
                .map((s) => {
                  const submited = JSON.parse(
                    s.submitions as unknown as string,
                  );
                  return submited[field.id];
                })
                .filter(Boolean);
              return (
                <AccordionItem key={field.id} value={`item-${index}`}>
                  <AccordionTrigger className="font-semibold">
                    {field.label}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pl-4">
                      <p className="text-sm font-medium text-muted-foreground">
                        {responses.length} responses
                      </p>
                      <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                        {responses.map((response, resIndex) => (
                          <div
                            key={resIndex}
                            className="p-2 bg-muted/50 rounded-md text-sm"
                          >
                            {String(response)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
