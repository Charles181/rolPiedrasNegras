import type { APIRoute } from "astro";
import { invalidateSession, validateSessionToken, SESSION_COOKIE_NAME } from "../../../lib/auth";

export const POST: APIRoute = async ({ cookies, redirect }) => {
    const token = cookies.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
        const result = await validateSessionToken(token);
        if (result) {
            await invalidateSession(result.session.id);
        }
    }

    // Clear the session cookie
    cookies.delete(SESSION_COOKIE_NAME, { path: "/" });

    return redirect("/login");
};
