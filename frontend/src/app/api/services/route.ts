import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateJWT } from '@/lib/auth';

export async function GET() {
    try {
        const result = await query('SELECT * FROM services ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { title, description, category, icon } = body;

        if (!title || !category) {
            return NextResponse.json({ message: 'Title and category are required' }, { status: 400 });
        }

        const result = await query(
            'INSERT INTO services (title, description, category, icon) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, category, icon]
        );
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Error creating service:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
