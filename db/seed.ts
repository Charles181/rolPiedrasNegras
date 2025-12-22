import { db, User, Account } from 'astro:db';
import { hash } from "@node-rs/argon2";

export default async function seed() {
	console.log('Seeding database...');

	try {
		const now = new Date();
		const userId = 'admin_id_seed';

		// Hash password with Argon2
		const passwordHash = await hash("kmayte22", {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		// Insert admin user
		await db.insert(User).values({
			id: userId,
			name: 'Charly',
			email: 'csantillanj@gmail.com',
			role: 'admin',
			image: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Charly',
			emailVerified: true,
			createdAt: now,
			updatedAt: now
		});

		// Insert account with hashed password
		await db.insert(Account).values({
			id: 'admin_account_id',
			userId: userId,
			accountId: 'csantillanj@gmail.com',
			providerId: 'credential',
			password: passwordHash,
			createdAt: now,
			updatedAt: now
		});

		console.log('Admin seeded successfully with email: csantillanj@gmail.com, password: kmayte22');
	} catch (e: any) {
		if (e?.code === 'SQLITE_CONSTRAINT_UNIQUE') {
			console.log('Admin user already exists, skipping...');
		} else {
			console.log('Error seeding:', e);
		}
	}
}
