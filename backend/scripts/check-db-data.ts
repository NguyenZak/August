import pool from '../src/config/database.js';

async function checkData() {
    try {
        const tables = ['cases', 'services', 'reviews', 'partners', 'inquiries'];
        for (const table of tables) {
            const res = await pool.query(`SELECT COUNT(*) FROM ${table}`);
            console.log(`Table ${table}: ${res.rows[0].count} rows`);
            if (res.rows[0].count > 0) {
                const data = await pool.query(`SELECT * FROM ${table} LIMIT 2`);
                console.log(`Sample from ${table}:`, JSON.stringify(data.rows, null, 2));
            }
        }
        process.exit(0);
    } catch (error) {
        console.error('Error checking data:', error);
        process.exit(1);
    }
}

checkData();
