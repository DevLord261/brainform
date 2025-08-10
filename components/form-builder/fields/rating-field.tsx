"use client";
import { useState } from "react";
import { produce } from "immer";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FieldProps } from "./types";
import { FieldLabel } from "../field-label";

export function RatingFieldComponent({ field, updateField }: FieldProps) {
  const [rating, setRating] = useState(
    (field.extraAttributes?.defaultValue as number) || 0,
  );
  const maxStars = field.extraAttributes?.maxStars || 5;
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
      <div className="flex gap-1">
        {[...Array(maxStars)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-6 w-6 cursor-pointer",
              i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300",
            )}
            onClick={() => setRating(i + 1)}
          />
        ))}
      </div>
    </div>
  );
}
