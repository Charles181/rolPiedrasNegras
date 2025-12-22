
import bcrypt from 'bcrypt';

const password = process.argv[2];
const saltRounds = 10;

if (!password) {
    console.log('Please provide a password to hash');
    process.exit(1);
}

bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Hash:', hash);
});
