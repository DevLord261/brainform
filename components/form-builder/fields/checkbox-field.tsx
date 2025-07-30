"use client"
import { produce } from "immer"
import type { FieldProps } from "./types"
import { FieldLabel } from "../field-label"
import { Checkbox } from "@/components/ui/checkbox"

export function CheckboxFieldComponent({ field, updateField }: FieldProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={field.id} />
      <FieldLabel
        field={field}
        onUpdateLabel={(newLabel: string) => {
          const newField = produce(field, (draft) => {
            draft.label = newLabel
          })
          updateField(field.id, newField)
        }}
      />
    </div>
  )
}
