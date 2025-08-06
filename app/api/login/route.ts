import ContextDb from "@/db";
import JwtService from "@/lib/jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

interface rowtype {
  id: string;
  fullname: string;
  email: string;
  created_at: string;
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (!email || !password) return Response.json("Wrong Email or password");

  const db = ContextDb.getInstance().GetDb();

  const query = db.prepare(
    "SELECT id,fullname,email,created_at FROM users WHERE email = ? and password = ?",
  );
  const row = query.get(email, password) as rowtype | undefined;

  if (row) {
    const jwtservice = JwtService.getInstance();
    const token = (await jwtservice.GenerateToken(row.fullname)).toString();
    db.prepare("update users set token =? WHERE id=?").run(token, row.id);
    const cookieStore = await cookies();
    cookieStore.set("token", token);
    return Response.json({ user: row });
  } else return Response.json("Wrong Email or password");
}
