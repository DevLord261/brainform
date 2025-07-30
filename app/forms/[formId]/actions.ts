"use server"

import { memoryStore } from "@/lib/memory-store"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function submitForm(formId: string, formData: FormData) {
  const form = memoryStore.getForm(formId)
  if (!form) {
    throw new Error("Form not found")
  }

  const submissionData: Record<string, any> = {}
  formData.forEach((value, key) => {
    submissionData[key] = value
  })

  memoryStore.saveSubmission(formId, submissionData)

  revalidatePath(`/dashboard/forms/${formId}/submissions`)
  redirect(`/forms/${formId}/thank-you`)
}
