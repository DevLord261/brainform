"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { PropertiesProps } from "./types";

export function CheckboxGroupProperties({
  field,
  onAttributeChange,
}: PropertiesProps) {
  return (
    <>
      <div>
        <Label htmlFor="minSelections">Min Selections</Label>
        <Input
          id="minSelections"
          type="number"
          value={field.extraAttributes?.minSelections}
          onChange={(e) => onAttributeChange("minSelections", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="maxSelections">Max Selections (0 for unlimited)</Label>
        <Input
          id="maxSelections"
          type="number"
          value={field.extraAttributes?.maxSelections}
          onChange={(e) => onAttributeChange("maxSelections", e.target.value)}
        />
      </div>
    </>
  );
}
