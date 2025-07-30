"use client"
import { produce } from "immer"
import type { FieldProps } from "./types"
import { FieldLabel } from "../field-label"
import { Textarea } from "@/components/ui/textarea"

export function TextareaFieldComponent({ field, updateField }: FieldProps) {
  return (
    <div className="grid w-full gap-1.5">
      <FieldLabel
        field={field}
        onUpdateLabel={(newLabel: string) => {
          const newField = produce(field, (draft) => {
            draft.label = newLabel
          })
          updateField(field.id, newField)
        }}
      />
      <Textarea placeholder={field.extraAttributes?.placeholder} id={field.id} />
    </div>
  )
}
