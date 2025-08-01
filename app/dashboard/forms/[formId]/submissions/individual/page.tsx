export const dynamic = "force-dynamic";

import { memoryStore } from "@/lib/memory-store";
import { notFound } from "next/navigation";
import { IndividualResponseViewer } from "@/components/submissions/individual-response-viewer";

export default async function IndividualPage({
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

  if (submissions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          No submissions yet for this form.
        </p>
      </div>
    );
  }

  return <IndividualResponseViewer form={form} submissions={submissions} />;
}
