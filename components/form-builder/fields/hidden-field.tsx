"use client"
import type { FieldProps } from "./types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function HiddenFieldComponent({ field }: FieldProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5 p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
      <Label htmlFor={field.id} className="text-sm text-muted-foreground">
        Hidden Field: {field.label}
      </Label>
      <p className="text-xs text-muted-foreground">Default Value: {field.extraAttributes?.defaultValue || "Not set"}</p>
      <Input type="hidden" id={field.id} defaultValue={field.extraAttributes?.defaultValue} />
    </div>
  )
}
