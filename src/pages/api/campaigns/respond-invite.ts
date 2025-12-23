
import type { APIRoute } from "astro";
import { db, CampaignParticipant, eq, and } from "astro:db";

export const POST: APIRoute = async ({ request, locals }) => {
    const user = locals.user;
    if (!user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const data = await request.json();
    const { inviteId, accept } = data;

    if (!inviteId) {
        return new Response("Invite ID required", { status: 400 });
    }

    try {
        // Verify invite exists and belongs to user
        const participant = await db
            .select()
            .from(CampaignParticipant)
            .where(and(eq(CampaignParticipant.id, inviteId), eq(CampaignParticipant.userId, user.id)))
            .get();

        if (!participant) {
            return new Response("Invite not found", { status: 404 });
        }

        if (accept) {
            await db.update(CampaignParticipant)
                .set({ status: 'active' })
                .where(eq(CampaignParticipant.id, inviteId));
        } else {
            await db.delete(CampaignParticipant)
                .where(eq(CampaignParticipant.id, inviteId));
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (error) {
        console.error("Invite response error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
};
