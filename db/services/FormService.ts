"use server";
import ContextDb from "@/db";
import { Database } from "better-sqlite3";
import { FormWithId } from "../../lib/memory-store";
import { FormField } from "@/lib/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface user {
  id: string;
}
class FormService {
  private static instance: FormService;
  private db: Database;

  constructor() {
    this.db = ContextDb.getInstance().GetDb();
  }

  public static getInstance(): FormService {
    if (!FormService.instance) {
      FormService.instance = new FormService();
    }
    return FormService.instance;
  }

  public async CreateForm(form: FormWithId): Promise<{
    success: boolean;
    error?: string;
  }> {
    if (!form) {
      return { success: false, error: "failed to validate form" };
    }
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return redirect("/auth/login");
    const userid = this.db
      .prepare("select id from users where token=?")
      .get(token) as user;
    const insertform = this.db.prepare(
      "insert into form (id,title,description,imageUrl,tableName,owner_id,fields) values (?,?,?,?,?,?,?);",
    );
    try {
      const res = insertform.run(
        form.id,
        form.title,
        form.description,
        form.imageUrl || null,
        form.tableName || null,
        userid.id.toString(),
        JSON.stringify(form.fields),
      );
      if (res.changes) return { success: true };

      return { success: false, error: "failed to create form" };
    } catch (e) {
      console.error(e);
      return { success: false, error: "" + e };
    }
  }
}

export default FormService;
