import ContextDb from "@/db";
import { FormWithId } from "@/lib/memory-store";
import { FormField } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const db = ContextDb.getInstance().GetDb();
  try {
    const forms: FormWithId[] = db
      .prepare("select * from form;")
      .all() as FormWithId[];
    if (!forms) return NextResponse.json("no forms created");

    return NextResponse.json(forms);
  } catch (e) {
    console.error(e);
    return NextResponse.error();
  }
}
