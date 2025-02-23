import { NextRequest } from "next/server";

import { getPathname } from "./middleware/pathnameMiddleware";

export function middleware(request: NextRequest) {
  return getPathname(request);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
