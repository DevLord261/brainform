"use client"

import type React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Trash2, Copy, Settings } from "lucide-react"

import type { FormField } from "@/lib/types"
import { FormElements } from "@/lib/form-elements"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CanvasFieldProps {
  field: FormField
  removeField: (id: string) => void
  duplicateField: (id: string) => void
  isSelected: boolean
  onClick: (e: React.MouseEvent) => void
  updateField: (id: string, newField: FormField) => void
}

export function CanvasField({
  field,
  removeField,
  duplicateField,
  isSelected,
  onClick,
  updateField,
}: CanvasFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: field.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const FormComponent = FormElements.find((el) => el.type === field.type)?.formComponent

  if (!FormComponent) {
    return <div>Unsupported field type</div>
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn("p-4 relative group", isSelected && "ring-2 ring-primary")}
      onClick={onClick}
    >
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClick}>
          <Settings className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation()
            duplicateField(field.id)
          }}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={(e) => {
            e.stopPropagation()
            removeField(field.id)
          }}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
        <Button variant="ghost" size="icon" className="h-6 w-6 cursor-grab" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4" />
        </Button>
      </div>
      <FormComponent field={field} updateField={updateField} />
    </Card>
  )
}
