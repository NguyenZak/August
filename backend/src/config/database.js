import { Pool } from 'pg';
import dotenv from 'dotenv';
import dns from 'dns';
dotenv.config();
dns.setServers(['8.8.8.8', '1.1.1.1']);
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
export const query = async (text, params) => {
    try {
        return await pool.query(text, params);
    }
    catch (err) {
        console.error('Database query error:', err);
        throw err;
    }
};
export default pool;
//# sourceMappingURL=database.js.map