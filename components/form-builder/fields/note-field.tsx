"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { produce } from "immer"
import { Info } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FieldProps } from "./types"
import { Textarea } from "@/components/ui/textarea"

export function NoteFieldComponent({ field, updateField }: FieldProps) {
  const { content, style } = field.extraAttributes || {}
  const styleClasses = {
    info: "bg-blue-100 border-blue-400 text-blue-800 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-200",
    warning:
      "bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-700 dark:text-yellow-200",
    success:
      "bg-green-100 border-green-400 text-green-800 dark:bg-green-900/50 dark:border-green-700 dark:text-green-200",
    destructive: "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/50 dark:border-red-700 dark:text-red-200",
  }

  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setValue(content)
  }, [content])

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus()
      textareaRef.current?.select()
    }
  }, [isEditing])

  const handleBlur = () => {
    setIsEditing(false)
    if (value.trim() && value !== content) {
      const newField = produce(field, (draft) => {
        if (draft.extraAttributes) {
          draft.extraAttributes.content = value
        }
      })
      updateField(field.id, newField)
    } else {
      setValue(content) // Revert if empty or unchanged
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setValue(content)
      setIsEditing(false)
    }
  }

  return (
    <div
      className={cn(
        "p-4 border-l-4 rounded-r-lg",
        styleClasses[style as keyof typeof styleClasses] || styleClasses.info,
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <Info className="h-5 w-5" />
        </div>
        <div className="ml-3 flex-1">
          {isEditing ? (
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="text-sm bg-transparent border-primary ring-offset-0 focus-visible:ring-1 focus-visible:ring-primary"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <p
              className="text-sm cursor-pointer"
              onClick={(e) => {
                e.stopPropagation()
                setIsEditing(true)
              }}
            >
              {content}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
