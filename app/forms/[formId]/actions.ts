"use server";

import ContextDb from "@/db";
import { User } from "@/lib/auth";
import { FormWithId } from "@/lib/memory-store";
import { writeFile } from "fs/promises";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import path from "path";

type submitions = Record<string, string>;
export async function submitForm(formId: string, formData: FormData) {
  const userapi = await fetch("http://localhost:3000/api/getuser");
  const user: User = await userapi.json();

  if (!user) {
    throw new Error("user not found");
  }

  const db = ContextDb.getInstance().GetDb();
  const submitions: submitions = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("$ACTION")) {
      continue;
    }
    let finalvalue: string;
    if (value instanceof File) {
      const bytes = await value.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${value.name}`;
      const filePath = path.join(process.cwd(), "public/uploads", filename);

      await writeFile(filePath, buffer);
      finalvalue = `http://localhost:3000/uploads/${filename}`;
    } else {
      finalvalue = value as string;
    }
    submitions[key] = finalvalue;
  }

  db.prepare(
    `INSERT INTO formsubmition(id, form_id, user_id, submitions) VALUES (?, ?, ?, ?)`,
  ).run(crypto.randomUUID(), formId, user.id, JSON.stringify(submitions));

  db.prepare(`UPDATE form SET submitions = submitions + 1 WHERE id = ?`).run(
    formId,
  );

  revalidatePath(`/dashboard/forms/${formId}/submissions`);
  redirect(`/forms/${formId}/thank-you`);
}
