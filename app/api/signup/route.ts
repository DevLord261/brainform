import ContextDb from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { fullname, email, password } = await request.json();
  const created_at = new Date().toISOString().split("T").at(0);

  const db = ContextDb.getInstance().GetDb();

  const query = db.prepare(
    "insert into users (fullname,email,password,created_at) values (@fullname,@email,@password,@created_at)",
  );

  try {
    const row = query.run({
      fullname: fullname,
      email: email,
      password: password,
      created_at: created_at,
    });
    if (row.changes) {
      return Response.json("Signup successfull");
    }

    return NextResponse.json({ success: false });
  } catch (e) {
    return Response.json("Email Already exists:");
  }
}
