import { FormBuilder } from "@/components/form-builder/form-builder"
import { memoryStore } from "@/lib/memory-store"
import { notFound } from "next/navigation"

export default function FormBuilderPage({ params }: { params: { formId: string } }) {
  const { formId } = params
  const isNewForm = formId === "new"

  if (isNewForm) {
    return (
      <div className="h-full w-full">
        <FormBuilder />
      </div>
    )
  }

  const form = memoryStore.getForm(formId)

  if (!form) {
    notFound()
  }

  return (
    <div className="h-full w-full">
      <FormBuilder initialForm={form} />
    </div>
  )
}
