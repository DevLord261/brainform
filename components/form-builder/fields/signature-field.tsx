"use client"
import { produce } from "immer"
import SignatureCanvas from "react-signature-canvas"
import type { FieldProps } from "./types"
import { FieldLabel } from "../field-label"

export function SignatureFieldComponent({ field, updateField }: FieldProps) {
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
      <div className="border rounded-md bg-background">
        <SignatureCanvas
          canvasProps={{
            id: field.id,
            width: 350,
            height: 150,
            className: "sigCanvas",
          }}
        />
      </div>
    </div>
  )
}
