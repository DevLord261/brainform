"use client"
import { produce } from "immer"
import type { FieldProps } from "./types"
import { FieldLabel } from "../field-label"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function CheckboxGroupFieldComponent({ field, updateField }: FieldProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-2">
      <FieldLabel
        field={field}
        onUpdateLabel={(newLabel: string) => {
          const newField = produce(field, (draft) => {
            draft.label = newLabel
          })
          updateField(field.id, newField)
        }}
      />
      <div className="space-y-2">
        {field.extraAttributes?.options?.map((option: string) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox id={`${field.id}-${option}`} />
            <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
          </div>
        ))}
      </div>
    </div>
  )
}
