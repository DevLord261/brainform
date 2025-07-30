"use client"

import { iconMap, iconList } from "@/lib/icons"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface IconPickerProps {
  value: string
  onChange: (value: string) => void
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select an icon" />
      </SelectTrigger>
      <SelectContent>
        {iconList.map((iconName) => {
          const IconComponent = iconMap[iconName as keyof typeof iconMap]
          return (
            <SelectItem key={iconName} value={iconName}>
              <div className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span>{iconName}</span>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
