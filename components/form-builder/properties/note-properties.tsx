"use client"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PropertiesProps } from "./types"

export function NoteProperties({ field, onAttributeChange }: PropertiesProps) {
  return (
    <>
      <div>
        <Label htmlFor="content">Note Content</Label>
        <Textarea
          id="content"
          value={field.extraAttributes?.content}
          onChange={(e) => onAttributeChange("content", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="noteStyle">Note Style</Label>
        <Select value={field.extraAttributes?.style} onValueChange={(value) => onAttributeChange("style", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select style..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="info">Info (Blue)</SelectItem>
            <SelectItem value="warning">Warning (Yellow)</SelectItem>
            <SelectItem value="success">Success (Green)</SelectItem>
            <SelectItem value="destructive">Destructive (Red)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
