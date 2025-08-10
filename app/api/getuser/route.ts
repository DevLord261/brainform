import ContextDb from "@/db";
import { User } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const db = ContextDb.getInstance().GetDb();

  if (!token) return NextResponse.json("user not found need login");

  const user = db
    .prepare("select id,fullname,email,created_at from users where token =? ")
    .get(token) as User;

  if (!user) return NextResponse.json("user not found need login");

  return NextResponse.json(user);
}
