/// <reference path="../.astro/types.d.ts" />

interface User {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: string;
}

interface Session {
    id: string;
    userId: string;
    expiresAt: Date;
}

declare namespace App {
    interface Locals {
        user: User | null;
        session: Session | null;
    }
}
