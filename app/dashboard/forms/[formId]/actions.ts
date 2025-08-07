"use server";

import FormService from "@/db/services/FormService";
import { type FormWithId } from "@/lib/memory-store";
import { revalidatePath } from "next/cache";

export async function saveFormAction(form: FormWithId) {
  const formservice = FormService.getInstance();
  try {
    formservice.CreateForm(form);
    revalidatePath("/dashboard");
    return { success: true, formId: form.id };
  } catch (error) {
    console.error("Failed to save form:", error);
    return { success: false, error: "Failed to save form." };
  }
}
