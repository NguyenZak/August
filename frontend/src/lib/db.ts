import { Pool, PoolConfig } from 'pg';

const connectionString = process.env.DATABASE_URL || '';
// For serverless, ensure we use a connection string that's durable.
const safeConnectionString = connectionString.includes('supabase.co') && !connectionString.includes('pgbouncer=true')
    ? `${connectionString}?pgbouncer=true&connection_limit=1`
    : connectionString;

const pgConfig: PoolConfig = {
    connectionString: safeConnectionString,
    ssl: {
        rejectUnauthorized: false
    },
    max: 5, // Keep low for serverless
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 5000,
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
