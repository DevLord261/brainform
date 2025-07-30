"use client"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FieldProps } from "./types"

export function DownloadFieldComponent({ field }: FieldProps) {
  const { linkText } = field.extraAttributes || {}
  return (
    <Button asChild variant="outline">
      <a href="#" onClick={(e) => e.preventDefault()}>
        <Download className="mr-2 h-4 w-4" />
        {linkText}
      </a>
    </Button>
  )
}
