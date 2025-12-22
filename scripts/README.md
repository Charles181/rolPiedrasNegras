
# Scripts

## Password Hashing
To generate a hashed password for manual database seeding or update:

```bash
node scripts/hash.js "your_password_here"
```

This uses `bcrypt` with 10 salt rounds, generating a hash compatible with `better-auth` (when configured for bcrypt).
