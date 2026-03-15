import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

const pgConfig = {
    connectionString: "postgresql://postgres:TEVW3wsIrmlQ9flc@db.ejxpjpzgddmbicallhjl.supabase.co:5432/postgres",
    ssl: { rejectUnauthorized: false }
};

export async function GET(req: NextRequest) {
    const client = new Client(pgConfig);
    try {
        await client.connect();
        const result = await client.query('SELECT * FROM chat_logs ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error: any) {
        console.error('Error fetching chat logs:', error);
        return NextResponse.json({ message: 'Error fetching chat logs', error: error.message }, { status: 500 });
    } finally {
        await client.end();
    }
}
