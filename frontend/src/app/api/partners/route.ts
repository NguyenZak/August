import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateJWT } from '@/lib/auth';

export async function GET() {
    try {
        const result = await query('SELECT * FROM partners ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching partners:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { name, logo, website } = body;

        if (!name) {
            return NextResponse.json({ message: 'Name is required' }, { status: 400 });
        }

        const result = await query(
            'INSERT INTO partners (name, logo, website) VALUES ($1, $2, $3) RETURNING *',
            [name, logo, website]
        );
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Error creating partner:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
