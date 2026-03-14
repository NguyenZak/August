import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateJWT } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const result = await query('SELECT * FROM folders ORDER BY name ASC');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching folders:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { name, parent_id } = body;

        if (!name) return NextResponse.json({ message: 'Folder name is required' }, { status: 400 });

        const result = await query(
            'INSERT INTO folders (name, parent_id) VALUES ($1, $2) RETURNING *',
            [name, parent_id]
        );
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Error creating folder:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
