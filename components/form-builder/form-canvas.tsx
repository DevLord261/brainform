"use client"

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { FormField } from "@/lib/types"
import { CanvasField } from "./canvas-field"
import { Card, CardContent } from "@/components/ui/card"
import { LayoutGrid } from "lucide-react"

interface FormCanvasProps {
  fields: FormField[]
  removeField: (id: string) => void
  duplicateField: (id: string) => void
  selectedField: FormField | null
  setSelectedField: (field: FormField | null) => void
  updateField: (id: string, newField: FormField) => void
}

export function FormCanvas({
  fields,
  removeField,
  duplicateField,
  selectedField,
  setSelectedField,
  updateField,
}: FormCanvasProps) {
  return (
    <Card
      className="min-h-[600px] p-4 bg-background"
      onClick={() => {
        if (selectedField) {
          setSelectedField(null)
        }
      }}
    >
      <CardContent className="p-0">
        <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
          {fields.length > 0 ? (
            <div className="space-y-2">
              {fields.map((field) => (
                <CanvasField
                  key={field.id}
                  field={field}
                  removeField={removeField}
                  duplicateField={duplicateField}
                  isSelected={selectedField?.id === field.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedField(field)
                  }}
                  updateField={updateField}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[500px] border-2 border-dashed rounded-lg bg-muted/50">
              <div className="text-center">
                <div className="mx-auto h-12 w-12 text-muted-foreground">
                  <LayoutGrid className="h-full w-full" />
                </div>
                <h3 className="mt-2 text-sm font-medium text-foreground">No fields yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Drag and drop fields from the left panel to start building your form.
                </p>
              </div>
            </div>
          )}
        </SortableContext>
      </CardContent>
    </Card>
  )
}
