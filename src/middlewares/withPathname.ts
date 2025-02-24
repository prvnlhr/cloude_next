import type { NextRequest, NextFetchEvent } from "next/server";
import { MiddlewareFactory } from "./middlewareTypes";

export const withPathname: MiddlewareFactory = (next) => {
  return async (request: NextRequest, event: NextFetchEvent) => {
    const headers = new Headers(request.headers);
    headers.set("x-current-path", request.nextUrl.pathname);

    const response = await next(request, event);
    // Ensure headers are preserved in the response
    response?.headers.set("x-current-path", request.nextUrl.pathname);

    return response;
  };
};
