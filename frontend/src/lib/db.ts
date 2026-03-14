import { Pool, PoolConfig } from 'pg';

const pgConfig: PoolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

let pool: Pool | null = null;

function getPool() {
    if (!pool) {
        pool = new Pool(pgConfig);
    }
    return pool;
}

export const query = async (text: string, params?: any[]) => {
    try {
        const client = await getPool().connect();
        try {
            return await client.query(text, params);
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Database query error:', err);
        throw err;
    }
};

export default getPool;
