import { hash, verify } from "@node-rs/argon2";
import { db, User, Session, eq } from "astro:db";

// Hash password using Argon2
export async function hashPassword(password: string): Promise<string> {
    return await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
}

// Verify password against hash
export async function verifyPassword(password: string, passwordHash: string): Promise<boolean> {
    try {
        return await verify(passwordHash, password);
    } catch {
        return false;
    }
}

// Generate a random session token
export function generateSessionToken(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Create a new session for a user
export async function createSession(userId: string, token: string): Promise<typeof Session.$inferSelect> {
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    const now = new Date();

    const sessionData = {
        id: crypto.randomUUID(),
        token,
        userId,
        expiresAt,
        createdAt: now,
        updatedAt: now,
        ipAddress: null,
        userAgent: null
    };

    await db.insert(Session).values(sessionData);

    return sessionData;
}

// Validate a session token and return the session + user if valid
export async function validateSessionToken(token: string): Promise<{ session: typeof Session.$inferSelect; user: typeof User.$inferSelect } | null> {
    const sessions = await db.select().from(Session).where(eq(Session.token, token));

    if (sessions.length === 0) {
        return null;
    }

    const session = sessions[0];

    // Check if session has expired
    if (new Date() >= session.expiresAt) {
        await db.delete(Session).where(eq(Session.id, session.id));
        return null;
    }

    // Get the user
    const users = await db.select().from(User).where(eq(User.id, session.userId));

    if (users.length === 0) {
        return null;
    }

    return { session, user: users[0] };
}

// Invalidate (delete) a session
export async function invalidateSession(sessionId: string): Promise<void> {
    await db.delete(Session).where(eq(Session.id, sessionId));
}

// Get user by email
export async function getUserByEmail(email: string): Promise<typeof User.$inferSelect | null> {
    const users = await db.select().from(User).where(eq(User.email, email));
    return users.length > 0 ? users[0] : null;
}

// Get user's password hash from Account table
export async function getUserPasswordHash(userId: string): Promise<string | null> {
    const { Account } = await import("astro:db");
    const accounts = await db.select().from(Account).where(eq(Account.userId, userId));

    if (accounts.length === 0 || !accounts[0].password) {
        return null;
    }

    return accounts[0].password;
}

// Create a new user with password
export async function createUser(
    email: string,
    password: string,
    name: string,
    role: string = 'user'
): Promise<typeof User.$inferSelect> {
    const { Account } = await import("astro:db");
    const now = new Date();
    const userId = crypto.randomUUID();
    const passwordHash = await hashPassword(password);

    const userData = {
        id: userId,
        email,
        name,
        role,
        emailVerified: false,
        image: null,
        createdAt: now,
        updatedAt: now
    };

    await db.insert(User).values(userData);

    await db.insert(Account).values({
        id: crypto.randomUUID(),
        userId,
        accountId: email,
        providerId: 'credential',
        password: passwordHash,
        createdAt: now,
        updatedAt: now
    });

    return userData;
}

// Cookie name for session
export const SESSION_COOKIE_NAME = "auth_session";
