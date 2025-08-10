import ContextDb from "@/db";
import { Submittions } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const db = ContextDb.getInstance().GetDb();
  const formId = request.nextUrl.searchParams.get("formId");
  const formsubmition = db
    .prepare(
      "select id,form_id,user_id,submitions,submitted_at from formsubmition where form_id=?;",
    )
    .all(formId) as Submittions[];

  return NextResponse.json(formsubmition);
}
