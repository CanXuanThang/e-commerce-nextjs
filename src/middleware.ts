import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware({
  ...routing,
  localeCookie: {
    name: "locale",
  },
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
