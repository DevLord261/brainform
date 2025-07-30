"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { PropertiesProps } from "./types"

export function FileProperties({ field, onAttributeChange }: PropertiesProps) {
  return (
    <>
      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <Label>Allow Multiple Files</Label>
        <Switch
          checked={field.extraAttributes?.multipleFiles}
          onCheckedChange={(checked) => onAttributeChange("multipleFiles", checked)}
        />
      </div>
      <div>
        <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
        <Input
          id="allowedFileTypes"
          value={field.extraAttributes?.allowedFileTypes}
          onChange={(e) => onAttributeChange("allowedFileTypes", e.target.value)}
          placeholder="e.g., image/*, .pdf, .docx"
        />
        <p className="text-xs text-muted-foreground mt-1">Use comma-separated MIME types or file extensions.</p>
      </div>
    </>
  )
}
