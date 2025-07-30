"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"

interface CustomCssModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  value: string
  onSave: (css: string) => void
}

export function CustomCssModal({ isOpen, onOpenChange, value, onSave }: CustomCssModalProps) {
  const [css, setCss] = useState(value)

  useEffect(() => {
    setCss(value)
  }, [value])

  const handleSave = () => {
    onSave(css)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Custom CSS</DialogTitle>
          <DialogDescription>
            Add custom CSS to your form. This will be applied within the scope of the form container.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={css}
            onChange={(e) => setCss(e.target.value)}
            placeholder="/* Example: [data-theme='default'] { --primary: #ff0000; } */"
            className="min-h-[300px] font-mono text-sm bg-muted"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save CSS
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
