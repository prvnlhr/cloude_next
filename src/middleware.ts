import { NextRequest, NextResponse } from "next/server";

import { getPathname } from "./middleware/pathnameMiddleware";
import { updateSession } from "./utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  const pathnameResponse = await getPathname(request);
  const sessionResponse = await updateSession(request);
  return pathnameResponse || sessionResponse || NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
