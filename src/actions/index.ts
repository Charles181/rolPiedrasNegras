
import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro:schema';
import { db, Post, User } from 'astro:db';
import { eq } from 'astro:db';

export const server = {
    createPost: defineAction({
        accept: 'json',
        input: z.object({
            title: z.string().min(1, "Title is required"),
            body: z.string().min(1, "Body is required"),
            image: z.string().optional(),
            category: z.string().min(1, "Category is required"),
            type: z.enum(['post', 'rule']).default('post'),
            status: z.enum(['draft', 'published']).default('published'), // Use status logic if needed, mapping to publishedAt
        }),
        handler: async (input, context) => {
            if (!context.locals.user) {
                throw new ActionError({
                    code: 'UNAUTHORIZED',
                    message: 'You must be logged in to create a post.',
                });
            }

            // Check if user is admin (optional, depending on requirements, but requirement said "admin")
            if (context.locals.user.role !== 'admin' && context.locals.user.role !== 'master') {
                // Allow masters too? "non-tech-savvy admins" usually implies restricted access. 
                // Checking user role in DB might be safer if locals.user can be stale, but locals is standard.
                // Let's stick to admin for now as per "admins can easily create".
                if (context.locals.user.role !== 'admin') {
                    throw new ActionError({
                        code: 'FORBIDDEN',
                        message: 'Only admins can create posts.',
                    });
                }
            }

            const slug = input.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');

            try {
                await db.insert(Post).values({
                    title: input.title,
                    slug: slug, // Potential collision
                    body: input.body,
                    image: input.image,
                    category: input.category,
                    type: input.type,
                    author: context.locals.user.name,
                    authorId: context.locals.user.id,
                    publishedAt: new Date(),
                });
            } catch (e: any) {
                if (e.message?.includes('UNIQUE constraint failed')) {
                    // Very basic retry with timestamp
                    const newSlug = `${slug}-${Date.now()}`;
                    await db.insert(Post).values({
                        title: input.title,
                        slug: newSlug,
                        body: input.body,
                        image: input.image,
                        category: input.category,
                        type: input.type,
                        author: context.locals.user.name,
                        authorId: context.locals.user.id,
                        publishedAt: new Date(),
                    });
                    return { success: true, slug: newSlug };
                }
                throw e;
            }

            return { success: true, slug };
        },
    }),
    updatePost: defineAction({
        accept: 'json',
        input: z.object({
            id: z.number(),
            title: z.string().min(1, "Title is required"),
            body: z.string().min(1, "Body is required"),
            image: z.string().optional(),
            category: z.string().min(1, "Category is required"),
            type: z.enum(['post', 'rule']).default('post'),
        }),
        handler: async (input, context) => {
            if (!context.locals.user || (context.locals.user.role !== 'admin' && context.locals.user.role !== 'master')) {
                throw new ActionError({ code: 'FORBIDDEN', message: 'Unauthorized' });
            }

            await db.update(Post).set({
                title: input.title,
                body: input.body,
                image: input.image,
                category: input.category,
                type: input.type,
            }).where(eq(Post.id, input.id));

            return { success: true };
        }
    }),
};
