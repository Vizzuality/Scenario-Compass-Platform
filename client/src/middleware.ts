import { NextRequest, NextResponse } from "next/server";
import { INTERNAL_PATHS } from "@/lib/paths";
import { env } from "./env";

export function middleware(request: NextRequest) {
  const isPreLaunch = env.NEXT_PUBLIC_PRE_LAUNCH_MODE;

  if (!isPreLaunch) {
    return NextResponse.next();
  }

  const allowedPaths = [INTERNAL_PATHS.HOME, INTERNAL_PATHS.ABOUT] as string[];
  const pathname = request.nextUrl.pathname;

  if (!allowedPaths.includes(pathname)) {
    return NextResponse.rewrite(new URL(INTERNAL_PATHS.NOT_FOUND, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
