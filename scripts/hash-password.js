
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
    const salt = randomBytes(16).toString('hex');
    const buf = await scryptAsync(password, salt, 64);

    console.log(`Password: ${password}`);
    // better-auth uses bcrypt by default usually, but we can't easily reproduce it without the library.
    // Recommended: Use the better-auth API to sign up users.
}

const args = process.argv.slice(2);
if (args.length > 0) {
    hashPassword(args[0]);
} else {
    console.log("Usage: node hash-password.js <password>");
}
