import type { APIRoute } from "astro";
import { createUser, getUserByEmail, generateSessionToken, createSession, SESSION_COOKIE_NAME } from "../../../lib/auth";

export const POST: APIRoute = async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString()?.trim();
    const password = formData.get("password")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();
    const name = formData.get("name")?.toString()?.trim();

    // Validation
    if (!email || !password || !name) {
        return new Response(JSON.stringify({ error: "Todos los campos son requeridos" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return new Response(JSON.stringify({ error: "El email no es válido" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Password length
    if (password.length < 8) {
        return new Response(JSON.stringify({ error: "La contraseña debe tener al menos 8 caracteres" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Password confirmation
    if (password !== confirmPassword) {
        return new Response(JSON.stringify({ error: "Las contraseñas no coinciden" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    // Name length
    if (name.length < 2) {
        return new Response(JSON.stringify({ error: "El nombre debe tener al menos 2 caracteres" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        // Check if user already exists
        const existingUser = await getUserByEmail(email);

        if (existingUser) {
            return new Response(JSON.stringify({ error: "Ya existe una cuenta con este email" }), {
                status: 409,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Create new user
        const user = await createUser(email, password, name, 'user');

        // Auto-login: create session
        const token = generateSessionToken();
        await createSession(user.id, token);

        // Set session cookie
        cookies.set(SESSION_COOKIE_NAME, token, {
            path: "/",
            httpOnly: true,
            secure: import.meta.env.PROD,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 // 30 days
        });

        return new Response(JSON.stringify({
            success: true,
            redirectUrl: "/",
            message: "Cuenta creada exitosamente"
        }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error: any) {
        console.error("Registration error:", error);

        if (error?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return new Response(JSON.stringify({ error: "Ya existe una cuenta con este email" }), {
                status: 409,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({ error: "Error al crear la cuenta. Intenta de nuevo." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
