import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher:['/',"/signin","/signup","/dashboard/:path*"]
}

export default async function proxy(req:NextRequest,res:NextResponse){
  const token = req.cookies.get('token')?.value
  const publicRoutes = ["/signup","/signin"]
  const isPublic = publicRoutes.includes(req.nextUrl.pathname)
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/signin',req.url))
  }
  if (token && isPublic) {
    return NextResponse.redirect(new URL('/',req.url))
  }
  return NextResponse.next()
}

