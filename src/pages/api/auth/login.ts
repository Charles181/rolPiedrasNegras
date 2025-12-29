import type { APIRoute } from "astro";
import { getUserByEmail, getUserPasswordHash, verifyPassword, createSession, generateSessionToken, SESSION_COOKIE_NAME } from "../../../lib/auth";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
        return new Response(JSON.stringify({ error: "Email y contraseña son requeridos" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Find user by email
    const user = await getUserByEmail(email);

    if (!user) {
        return new Response(JSON.stringify({ error: "Email o contraseña incorrectos" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Get password hash
    const passwordHash = await getUserPasswordHash(user.id);

    if (!passwordHash) {
        return new Response(JSON.stringify({ error: "Email o contraseña incorrectos" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Verify password
    const validPassword = await verifyPassword(password, passwordHash);

    if (!validPassword) {
        return new Response(JSON.stringify({ error: "Email o contraseña incorrectos" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Create session
    const token = generateSessionToken();
    const session = await createSession(user.id, token);

    // Set session cookie
    cookies.set(SESSION_COOKIE_NAME, token, {
        path: "/",
        httpOnly: true,
        secure: import.meta.env.PROD,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    // Return success with redirect URL
    const redirectUrl = (user.role === "admin" || user.role === "master") ? "/admin" : "/profile";

    return new Response(JSON.stringify({ success: true, redirectUrl }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
};
