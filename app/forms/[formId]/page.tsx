import { notFound } from "next/navigation";
import { memoryStore } from "@/lib/memory-store";
import { PublicFormRenderer } from "@/components/form-builder/public-form-renderer";
import { BrainCircuit, ShieldCheck } from "lucide-react";
import { submitForm } from "./actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Image from "next/image";

export default async function PublicFormPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const form = memoryStore.getForm(formId);

  if (!form) {
    notFound();
  }

  const formAction = submitForm.bind(null, form.id);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-background p-4 sm:p-8 relative">
      <Button
        asChild
        variant="outline"
        className="absolute top-4 right-4 z-10 bg-transparent"
      >
        <Link href={`/dashboard/forms/${form.id}`}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit Form
        </Link>
      </Button>
      {form.customCss && <style>{form.customCss}</style>}
      <div
        data-theme={form.theme || "default"}
        className="max-w-lg mx-auto bg-white dark:bg-card rounded-lg shadow-xl p-8 space-y-6"
      >
        <div className="text-center space-y-4">
          {form.imageUrl ? (
            <Image
              src={form.imageUrl || "/placeholder.svg"}
              alt="Form banner"
              className="rounded-md mb-4 max-h-48 w-full object-cover mx-auto"
            />
          ) : (
            <div className="flex flex-col items-center text-center">
              <BrainCircuit className="h-12 w-12" />
              <p className="text-sm font-bold tracking-wider">BRAINSPACE</p>
            </div>
          )}
          <h1 className="text-2xl font-bold tracking-tight">{form.title}</h1>
          <p className="text-muted-foreground">{form.description}</p>
        </div>

        <form action={formAction} className="space-y-4">
          <PublicFormRenderer form={form} />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </div>
      {form.recaptchaSettings?.enabled && form.recaptchaSettings.invisible && (
        <div className="fixed bottom-4 right-4">
          <div className="w-16 h-16 bg-gray-200 rounded-md flex flex-col items-center justify-center border text-muted-foreground shadow">
            <ShieldCheck className="h-6 w-6" />
            <p className="text-[8px] mt-1">reCAPTCHA</p>
          </div>
        </div>
      )}
    </div>
  );
}
