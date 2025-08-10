"use client";
import { produce } from "immer";
import type { FieldProps } from "./types";
import { FieldLabel } from "../field-label";
import { Input } from "@/components/ui/input";

export function ColorPickerFieldComponent({ field, updateField }: FieldProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <FieldLabel
        field={field}
        onUpdateLabel={(newLabel: string) => {
          const newField = produce(field, (draft) => {
            draft.label = newLabel;
          });
          updateField(field.id, newField);
        }}
      />
      <div className="flex items-center gap-2">
        <Input
          type="color"
          id={field.id}
          defaultValue={field.extraAttributes?.defaultValue as string}
          className="h-10 w-10 p-1"
        />
        <Input
          type="text"
          value={field.extraAttributes?.defaultValue as string}
          className="w-24"
          readOnly
        />
      </div>
    </div>
  );
}
