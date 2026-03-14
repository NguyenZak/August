import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateJWT } from '@/lib/auth';

export async function PUT(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { items } = body; // Array of { id, grid_row }

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ message: 'Invalid items array' }, { status: 400 });
        }

        await query('BEGIN');

        for (const item of items) {
            await query(
                'UPDATE cases SET grid_row = $1 WHERE id = $2',
                [item.grid_row, item.id]
            );
        }

        await query('COMMIT');
        return NextResponse.json({ message: 'Reordered successfully' });
    } catch (error) {
        await query('ROLLBACK');
        console.error('Error reordering cases:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
