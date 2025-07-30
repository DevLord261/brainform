"use server"

import { memoryStore, type FormWithId } from "@/lib/memory-store"
import { revalidatePath } from "next/cache"

export async function saveFormAction(form: FormWithId) {
  try {
    memoryStore.saveForm(form)
    revalidatePath("/dashboard")
    return { success: true, formId: form.id }
  } catch (error) {
    console.error("Failed to save form:", error)
    // In a real app, you might return an error object
    return { success: false, error: "Failed to save form." }
  }
}
