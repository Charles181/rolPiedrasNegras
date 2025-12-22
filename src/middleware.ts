import { validateSessionToken, SESSION_COOKIE_NAME } from "./lib/auth";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
    const token = context.cookies.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
        const result = await validateSessionToken(token);
        if (result) {
            context.locals.user = result.user;
            context.locals.session = result.session;
        } else {
            context.locals.user = null;
            context.locals.session = null;
        }
    } else {
        context.locals.user = null;
        context.locals.session = null;
    }

    // Protect admin routes
    if (context.url.pathname.startsWith("/admin") && !context.locals.session) {
        return context.redirect("/login");
    }

    return next();
});
