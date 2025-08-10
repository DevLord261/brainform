"use server";

import ContextDb from "@/db";
import { User } from "@/lib/auth";
import { FormWithId } from "@/lib/memory-store";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function submitForm(formId: string, formData: FormData) {
  const formres = await fetch(
    `http://localhost:3000/api/getform?formId=${formId}`,
  );
  const userapi = await fetch("http://localhost:3000/api/getuser");
  const user: User = await userapi.json();
  const form = (await formres.json()) as FormWithId;

  if (!form || !user) {
    throw new Error("Form not found");
  }
  const db = ContextDb.getInstance().GetDb();

  formData.forEach((value, key) => {
    if (key.startsWith("$ACTION")) {
      return;
    }
    db.prepare(
      "insert into formsubmition(id,form_id,user_id,field_id,value) values(?,?,?,?,?);",
    ).run(crypto.randomUUID(), formId, user.id, key, value);
  });

  db.prepare("update form set submitions = submitions+1 where id=?").run(
    formId,
  );

  revalidatePath(`/dashboard/forms/${formId}/submissions`);
  redirect(`/forms/${formId}/thank-you`);
}
