"use client"

import type { Form } from "@/lib/types"
import { PublicFieldRenderer } from "./public-field-renderer"

export function PublicFormRenderer({ form }: { form: Form }) {
  return (
    <div className="space-y-4">
      {form.fields.map((field) => (
        <PublicFieldRenderer key={field.id} field={field} form={form} />
      ))}
    </div>
  )
}
