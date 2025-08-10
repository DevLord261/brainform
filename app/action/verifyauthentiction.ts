"use server";

import ContextDb from "@/db";
import JwtService from "@/lib/jsonwebtoken";
import { cookies } from "next/headers";
interface usertoken {
  token: string;
}
export async function VerifyToken() {
  const cookieStore = await cookies();
  const sessiontoken = cookieStore.get("token")?.value;
  const db = ContextDb.getInstance().GetDb();
  const token = db
    .prepare("select token from users where token=?")
    .get(sessiontoken) as usertoken;

  if (!sessiontoken || token == undefined) {
    cookieStore.delete("token");
    return false;
  }
  try {
    const jwtService = JwtService.getInstance();
    const verify = await jwtService.VerifyToken(sessiontoken);
    return verify;
  } catch (e) {
    console.error(e);
    return null;
  }
}
