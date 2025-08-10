import ContextDb from "@/db";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  const { fullname, email, password } = await request.json();
  const created_at = new Date().toISOString().split("T").at(0);

  const db = ContextDb.getInstance().GetDb();

  const query = db.prepare(
    "insert into users (id,fullname,email,password,created_at) values (@id,@fullname,@email,@password,@created_at)",
  );
  const hashed = await bcrypt.hash(password, 1);
  const id = crypto.randomUUID();
  try {
    const row = query.run({
      id: id,
      fullname: fullname,
      email: email,
      password: hashed,
      created_at: created_at,
    });
    if (row.changes) {
      return Response.json("Signup successfull");
    }
    return NextResponse.json({ success: false });
  } catch (e) {
    console.error(e);
    return Response.json("Email Already exists:");
  }
}
