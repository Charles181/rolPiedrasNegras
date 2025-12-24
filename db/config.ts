
import { defineDb, defineTable, column } from 'astro:db';

export const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    email: column.text({ unique: true }),
    emailVerified: column.boolean(),
    image: column.text({ optional: true }),
    role: column.text({ default: 'user' }), // admin, user
    createdAt: column.date(),
    updatedAt: column.date(),
  }
});

export const Session = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    expiresAt: column.date(),
    token: column.text({ unique: true }),
    createdAt: column.date(),
    updatedAt: column.date(),
    ipAddress: column.text({ optional: true }),
    userAgent: column.text({ optional: true }),
    userId: column.text({ references: () => User.columns.id }),
  }
});

export const Account = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    accountId: column.text(),
    providerId: column.text(),
    userId: column.text({ references: () => User.columns.id }),
    accessToken: column.text({ optional: true }),
    refreshToken: column.text({ optional: true }),
    idToken: column.text({ optional: true }),
    accessTokenExpiresAt: column.date({ optional: true }),
    refreshTokenExpiresAt: column.date({ optional: true }),
    scope: column.text({ optional: true }),
    password: column.text({ optional: true }),
    createdAt: column.date(),
    updatedAt: column.date(),
  }
});

export const Verification = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    identifier: column.text(),
    value: column.text(),
    expiresAt: column.date(),
    createdAt: column.date({ optional: true }),
    updatedAt: column.date({ optional: true }),
  }
});

export const Campaign = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    description: column.text(),
    system: column.text({ optional: true }),
    nextSession: column.date({ optional: true }),
    totalSeats: column.number({ default: 0 }),
    masterId: column.text({ references: () => User.columns.id, default: 'Nano' }), // Creator/Master
    status: column.text({ default: 'ongoing' }), // ongoing, finished
    image: column.text({ optional: true }),
    createdAt: column.date({ default: new Date() }),
    updatedAt: column.date({ default: new Date() }),
  }
});

export const CampaignParticipant = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    campaignId: column.text({ references: () => Campaign.columns.id }),
    userId: column.text({ references: () => User.columns.id }),
    status: column.text({ default: 'active' }), // active, invited, requested
    role: column.text({ default: 'player' }), // player, master? (Master is usually defined in Campaign, but maybe co-masters?)
    createdAt: column.date({ default: new Date() }),
  }
});

export const Event = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    name: column.text(),
    date: column.date(),
    description: column.text({ optional: true }),
    campaignId: column.text({ references: () => Campaign.columns.id }),
  }
});

export const Post = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    title: column.text(),
    content: column.text(), // Markdown or HTML
    type: column.text({ default: 'post' }), // post, rule
    published: column.boolean({ default: false }),
    authorId: column.text({ references: () => User.columns.id }),
    createdAt: column.date({ default: new Date() }),
  }
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    User,
    Session,
    Account,
    Verification,
    Campaign,
    CampaignParticipant,
    Event,
    Post
  }
});
