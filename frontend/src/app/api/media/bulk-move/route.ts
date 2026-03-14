import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateJWT } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { ids, folder_id } = body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ message: 'Invalid IDs' }, { status: 400 });
        }

        await query(
            'UPDATE media SET folder_id = $1 WHERE id = ANY($2)',
            [folder_id === 'root' ? null : folder_id, ids]
        );
        return NextResponse.json({ message: 'Bulk move successful' });
    } catch (error) {
        console.error('Error bulk moving media:', error);
        return NextResponse.json({ message: 'Failed to move media' }, { status: 500 });
    }
}
