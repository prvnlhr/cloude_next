import { createServerClient } from "@supabase/ssr";
import {
  NextResponse,
  type NextRequest,
  type NextFetchEvent,
} from "next/server";

import { MiddlewareFactory } from "../middlewareTypes";

export const updateSession: MiddlewareFactory = (next) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            );

            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const pathname = request.nextUrl.pathname;

    if (user) {
      // User is authenticated
      if (
        pathname.startsWith("/cloude/auth/sign-in") ||
        pathname.startsWith("/cloude/auth/sign-up")
      ) {
        // Redirect authenticated users away from sign-in and sign-up pages
        return NextResponse.redirect(
          new URL("/cloude/home/dashboard", request.url)
        );
      }
    } else {
      // User is not authenticated
      if (pathname.startsWith("/cloude/home")) {
        // Redirect unauthenticated users to the auth page
        return NextResponse.redirect(
          new URL("/cloude/auth/sign-in", request.url)
        );
      }
    }

    const response = await next(request, event);
    return response ?? supabaseResponse;
  };
};
