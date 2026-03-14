import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateJWT } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const folder_id = req.nextUrl.searchParams.get('folder_id');
        let queryText = 'SELECT * FROM media';
        const params: any[] = [];

        if (folder_id === 'root') {
            queryText += ' WHERE folder_id IS NULL';
        } else if (folder_id) {
            queryText += ' WHERE folder_id = $1';
            params.push(folder_id);
        }

        queryText += ' ORDER BY created_at DESC';
        const result = await query(queryText, params);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching media:', error);
        return NextResponse.json({ message: 'Failed to fetch media' }, { status: 500 });
    }
}
