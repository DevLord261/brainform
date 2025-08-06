import JwtService from '@/lib/jsonwebtoken';
import cookie from 'cookie';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest){
  try{
    const cookies = cookie.parse(request.headers.cookie || '');
    const token = cookies.token;

    if(!token) return NextResponse.json({error:"Unauthorized: No Token"})

    const service = JwtService.getInstance();
    const result =service.VerifyToken(token)

    if(!result) return NextResponse.json({error:"Unauthorized: Token invalid"})

    return NextResponse.json("Authorized")
  }
}
