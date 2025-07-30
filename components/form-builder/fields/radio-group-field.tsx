"use client"
import { produce } from "immer"
import type { FieldProps } from "./types"
import { FieldLabel } from "../field-label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export function RadioGroupFieldComponent({ field, updateField }: FieldProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <FieldLabel
        field={field}
        onUpdateLabel={(newLabel: string) => {
          const newField = produce(field, (draft) => {
            draft.label = newLabel
          })
          updateField(field.id, newField)
        }}
      />
      <RadioGroup id={field.id}>
        {field.extraAttributes?.options?.map((option: string) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={`${field.id}-${option}`} />
            <Label htmlFor={`${field.id}-${option}`}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
