"use client"
import { produce } from "immer"
import type { FieldProps } from "./types"
import { FieldLabel } from "../field-label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SelectFieldComponent({ field, updateField }: FieldProps) {
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
      <Select>
        <SelectTrigger id={field.id}>
          <SelectValue placeholder={field.extraAttributes?.placeholder} />
        </SelectTrigger>
        <SelectContent>
          {field.extraAttributes?.options?.map((option: string) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
