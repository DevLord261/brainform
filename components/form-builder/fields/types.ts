import type { FormField } from "@/lib/types"

export interface FieldProps {
  field: FormField
  updateField: (id: string, newField: FormField) => void
}
