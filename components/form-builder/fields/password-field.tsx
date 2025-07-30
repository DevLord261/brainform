"use client"
import { useState } from "react"
import { produce } from "immer"
import { Eye, EyeOff } from "lucide-react"
import type { FieldProps } from "./types"
import { FieldLabel } from "../field-label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function PasswordFieldComponent({ field, updateField }: FieldProps) {
  const [showPassword, setShowPassword] = useState(false)
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
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          id={field.id}
          placeholder={field.extraAttributes?.placeholder}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
