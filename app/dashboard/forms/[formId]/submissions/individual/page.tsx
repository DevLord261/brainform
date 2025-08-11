export const dynamic = "force-dynamic";

import { FormWithId, memoryStore } from "@/lib/memory-store";
import { notFound } from "next/navigation";
import { IndividualResponseViewer } from "@/components/submissions/individual-response-viewer";
import { Submittions } from "@/lib/types";

export default async function IndividualPage({
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

  return <IndividualResponseViewer form={form} submissions={submissions} />;
}
