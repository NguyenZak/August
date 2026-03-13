import { query } from './src/config/database.js';
import dotenv from 'dotenv';
dotenv.config();
async function checkUsers() {
    try {
        const result = await query('SELECT id, email, password_hash FROM users');
        console.log('--- Users in Database ---');
        console.table(result.rows);
        if (result.rows.length === 0) {
            console.log('No users found in database.');
        }
    }
    catch (error) {
        console.error('Error checking users:', error);
    }
    finally {
        process.exit();
    }
}
checkUsers();
//# sourceMappingURL=check-users.js.map