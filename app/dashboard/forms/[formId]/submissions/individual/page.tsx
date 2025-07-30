export const dynamic = "force-dynamic"

import { memoryStore } from "@/lib/memory-store"
import { notFound } from "next/navigation"
import { IndividualResponseViewer } from "@/components/submissions/individual-response-viewer"

export default function IndividualPage({ params }: { params: { formId: string } }) {
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

  return <IndividualResponseViewer form={form} submissions={submissions} />
}
