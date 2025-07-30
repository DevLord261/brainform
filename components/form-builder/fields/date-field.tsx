"use client"
import { produce } from "immer"
import type { FieldProps } from "./types"
import { FieldLabel } from "../field-label"
import { Input } from "@/components/ui/input"

export function DateFieldComponent({ field, updateField }: FieldProps) {
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
      <Input type="date" id={field.id} />
    </div>
  )
}
