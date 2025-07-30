export const dynamic = "force-dynamic"

import { memoryStore } from "@/lib/memory-store"
import { notFound } from "next/navigation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function QuestionsPage({ params }: { params: { formId: string } }) {
  const form = memoryStore.getForm(params.formId)
  const submissions = memoryStore.getSubmissions(params.formId)

  if (!form) {
    notFound()
  }

  if (submissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No submissions yet for this form.</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Responses by Question</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {form.fields
            .filter((field) => !["hidden", "password"].includes(field.type))
            .map((field, index) => {
              const dbColumnName = field.extraAttributes?.dbColumnName || field.label
              const responses = submissions.map((s) => s.data[dbColumnName]).filter(Boolean)
              return (
                <AccordionItem key={field.id} value={`item-${index}`}>
                  <AccordionTrigger className="font-semibold">{field.label}</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pl-4">
                      <p className="text-sm font-medium text-muted-foreground">{responses.length} responses</p>
                      <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                        {responses.map((response, resIndex) => (
                          <div key={resIndex} className="p-2 bg-muted/50 rounded-md text-sm">
                            {String(response)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
        </Accordion>
      </CardContent>
    </Card>
  )
}
