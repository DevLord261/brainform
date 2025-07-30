"use client"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PropertiesProps } from "./types"

export function StaticTextProperties({ field, onAttributeChange }: PropertiesProps) {
  return (
    <>
      <div>
        <Label htmlFor="content">Text Content</Label>
        <Textarea
          id="content"
          value={field.extraAttributes?.content}
          onChange={(e) => onAttributeChange("content", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="textSize">Text Size</Label>
        <Select value={field.extraAttributes?.textSize} onValueChange={(value) => onAttributeChange("textSize", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select size..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sm">Small</SelectItem>
            <SelectItem value="base">Base</SelectItem>
            <SelectItem value="lg">Large</SelectItem>
            <SelectItem value="xl">Extra Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
