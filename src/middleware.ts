import { chainMiddleware } from "./middlewares/chainMiddleware";
import { updateSession } from "./middlewares/supabase/middleware";
import { withPathname } from "./middlewares/withPathname";

const middlewares = [updateSession, withPathname];
export default chainMiddleware(middlewares);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
