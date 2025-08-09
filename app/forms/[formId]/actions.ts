"use server";

import { FormWithId } from "@/lib/memory-store";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitForm(formId: string, formData: FormData) {
  const formres = await fetch(
    `http://localhost:3000/api/getform?formId=${formId}`,
  );
  const form = (await formres.json()) as FormWithId;
  if (!form) {
    throw new Error("Form not found");
  }
  const submissionData: Record<string, FormDataEntryValue> = {};
  formData.forEach((value, key) => {
    if (key.startsWith("$ACTION")) {
      return;
    }
    submissionData[key] = value;
  });
  // console.log(submissionData);

  revalidatePath(`/dashboard/forms/${formId}/submissions`);
  redirect(`/forms/${formId}/thank-you`);
}
