import ContextDb from "@/db";
import JwtService from "@/lib/jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import * as bcrypt from "bcrypt";

interface rowtype {
  password: string;
}
interface User {
  id: string;
  fullname: string;
  email: string;
  created_at: string;
  verified: string;
}
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (!email || !password) return Response.json("Wrong Email or password");

  const db = ContextDb.getInstance().GetDb();

  const query = db.prepare("SELECT password FROM users WHERE email = ?");
  const row = query.get(email) as rowtype | undefined;

  if (row && (await bcrypt.compare(password, row.password))) {
    const user = db
      .prepare(
        "SELECT id,email,fullname,created_at,verified FROM users WHERE email=?",
      )
      .get(email) as User;
    const jwtservice = JwtService.getInstance();
    const token = (await jwtservice.GenerateToken(user.fullname)).toString();
    db.prepare("update users set token =? WHERE id=?").run(token, user.id);

    const cookieStore = await cookies();
    cookieStore.set("token", token);

    return Response.json({ user: user });
  } else return Response.json("Wrong Email or password");
}
