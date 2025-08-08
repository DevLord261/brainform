import ContextDb from "@/db";
import { FormWithId } from "@/lib/memory-store";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const db = ContextDb.getInstance().GetDb();
  const formId = request.nextUrl.searchParams.get("formId");
  if (!formId) return NextResponse.error();
  try {
    const formData = db
      .prepare("select * from form where id=?")
      .get(formId) as FormWithId;
    // const fields = db
    //   .prepare("select fields from form where id=?")
    //   .get(formId) as fields;
    if (!formData) {
      return NextResponse.json(null, { status: 404 });
    }
    formData.fields = JSON.parse(formData.fields as string);
    return NextResponse.json(formData);
  } catch (e) {
    console.log(e);
    return NextResponse.error();
  }
}
