"use client"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { PropertiesProps } from "./types"

export function PasswordProperties({ field, onAttributeChange, fields = [] }: PropertiesProps) {
  const passwordFields = fields.filter((f) => f.type === "password" && f.id !== field.id)

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <Label>Require Number</Label>
        <Switch
          checked={field.extraAttributes?.requireNumber}
          onCheckedChange={(checked) => onAttributeChange("requireNumber", checked)}
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
        <Label>Require Special Character</Label>
        <Switch
          checked={field.extraAttributes?.requireSpecialChar}
          onCheckedChange={(checked) => onAttributeChange("requireSpecialChar", checked)}
        />
      </div>
      <div>
        <Label htmlFor="minLength">Min Length</Label>
        <Input
          id="minLength"
          type="number"
          value={field.extraAttributes?.minLength}
          onChange={(e) => onAttributeChange("minLength", Number.parseInt(e.target.value))}
        />
      </div>
      <div>
        <Label htmlFor="confirmationField">Confirmation Field</Label>
        <Select
          value={field.extraAttributes?.confirmationField}
          onValueChange={(value) => onAttributeChange("confirmationField", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select field..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {passwordFields.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  )
}
