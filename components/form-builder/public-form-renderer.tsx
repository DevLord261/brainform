"use client";

import type { Form, FormField } from "@/lib/types";
import { PublicFieldRenderer } from "./public-field-renderer";

export function PublicFormRenderer({ form }: { form: Form }) {
  const parsedfields = form.fields as FormField[];
  return (
    <div className="space-y-4">
      {parsedfields.map((field: FormField) => (
        <PublicFieldRenderer key={field.id} field={field} form={form} />
      ))}
    </div>
  );
}
