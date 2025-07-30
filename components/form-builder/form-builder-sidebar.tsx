"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { FormElements } from "@/lib/form-elements"
import type { FormElement, FormElementCategory } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const elementCategories: FormElementCategory[] = [
  "Standard Fields",
  "Choice Fields",
  "Date & Time",
  "Advanced Fields",
  "Static Elements",
]

export function FormBuilderSidebar({ addField }: { addField: (element: FormElement) => void }) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredElements = FormElements.filter((el) => el.label.toLowerCase().includes(searchTerm.toLowerCase()))

  const elementsByCategory = (category: FormElementCategory) => {
    return filteredElements.filter((el) => el.category === category)
  }

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b space-y-4">
        <h2 className="text-xl font-bold">Elements</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search fields..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-2">
        <Accordion type="multiple" defaultValue={elementCategories} className="w-full">
          {elementCategories.map((category) => {
            const categoryElements = elementsByCategory(category)
            if (categoryElements.length === 0) {
              return null
            }
            return (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger className="font-medium">{category}</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2 p-2">
                    {categoryElements.map((element) => (
                      <Button
                        key={element.type}
                        variant="outline"
                        className="flex flex-col items-center justify-center h-24 gap-2 bg-transparent hover:shadow-md transition-shadow"
                        onClick={() => addField(element)}
                      >
                        <element.icon className="h-8 w-8 text-primary" />
                        <span className="text-xs text-center">{element.label}</span>
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>
    </div>
  )
}
