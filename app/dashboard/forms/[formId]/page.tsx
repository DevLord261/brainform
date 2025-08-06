import { AuthGuard } from "@/components/auth/auth-guard";
import { FormBuilder } from "@/components/form-builder/form-builder";
import { memoryStore } from "@/lib/memory-store";
import { notFound } from "next/navigation";

export default async function FormBuilderPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const isNewForm = formId === "new";

  if (isNewForm) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="h-full w-full">
          <FormBuilder />
        </div>
      </AuthGuard>
    );
  }

  const form = memoryStore.getForm(formId);

  if (!form) {
    notFound();
  }

  return (
    <div className="h-full w-full">
      <FormBuilder initialForm={form} />
    </div>
  );
}
