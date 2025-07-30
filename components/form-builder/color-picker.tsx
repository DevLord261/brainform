"use client"

import { cn } from "@/lib/utils"

const colors = ["#000000", "#ef4444", "#3b82f6", "#22c55e", "#a855f7", "#f97316"]

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2 mt-2 flex-wrap">
      <button
        type="button"
        onClick={() => onChange("")}
        className="text-xs text-muted-foreground hover:text-foreground border rounded-md px-2 py-1"
      >
        Default
      </button>
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          className={cn(
            "h-6 w-6 rounded-full border-2 transition-all",
            value === color ? "border-primary scale-110" : "border-transparent",
          )}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
        />
      ))}
      <div className="relative">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 p-0 border-none rounded-full cursor-pointer opacity-0 absolute inset-0"
        />
        <div className="h-8 w-8 rounded-full border" style={{ backgroundColor: value || "transparent" }} />
      </div>
    </div>
  )
}
