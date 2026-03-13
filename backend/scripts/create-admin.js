import bcrypt from 'bcrypt';
import { query } from '../src/config/database.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
async function createAdmin() {
    const email = process.argv[2] || 'admin@augustevents.co.uk';
    const password = process.argv[3] || 'admin123';
    try {
        console.log(`Creating admin user: ${email}...`);
        const hashedPassword = await bcrypt.hash(password, 10);
        await query('INSERT INTO users (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING', [email, hashedPassword]);
        console.log('Admin user ready.');
        process.exit(0);
    }
    catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}
createAdmin();
//# sourceMappingURL=create-admin.js.map