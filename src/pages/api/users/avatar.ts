
import type { APIRoute } from "astro";
import { db, User, eq } from "astro:db";
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

export const POST: APIRoute = async ({ request, locals }) => {
    const user = locals.user;
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("avatar") as File;

    if (!file || !file.size) {
        return new Response("No file provided", { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
        return new Response("Invalid file type", { status: 400 });
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `avatar-${user.id}-${Date.now()}.webp`;
        const publicDir = path.join(process.cwd(), "public");
        const uploadDir = path.join(publicDir, "uploads", "avatars");
        const filepath = path.join(uploadDir, filename);

        // Ensure dir exists (redundant if mkdir run, but safe)
        await fs.mkdir(uploadDir, { recursive: true });

        // Resize and save
        await sharp(buffer)
            .resize(200, 200, { fit: "cover" })
            .toFormat("webp")
            .toFile(filepath);

        const imageUrl = `/uploads/avatars/${filename}`;

        // Update DB
        await db.update(User).set({ image: imageUrl }).where(eq(User.id, user.id));

        return new Response(JSON.stringify({ imageUrl }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Avatar upload error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
};
