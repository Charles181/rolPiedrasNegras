
import type { APIRoute } from "astro";
import { db, User, eq } from "astro:db";

export const POST: APIRoute = async ({ request, locals }) => {
    const user = locals.user;
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const data = await request.json();
    const { username } = data;

    if (!username) {
        return new Response("Username required", { status: 400 });
    }

    try {
        await db.update(User).set({ name: username }).where(eq(User.id, user.id));
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Update profile error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
};
