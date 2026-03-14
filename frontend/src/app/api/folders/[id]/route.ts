import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateJWT } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const body = await req.json();
        const { name, parent_id } = body;

        const result = await query(
            'UPDATE folders SET name = COALESCE($1, name), parent_id = $2 WHERE id = $3 RETURNING *',
            [name, parent_id === undefined ? undefined : parent_id, id]
        );

        if (result.rowCount === 0) return NextResponse.json({ message: 'Folder not found' }, { status: 404 });
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating folder:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        // Move files to root before deleting folder
        await query('UPDATE media SET folder_id = NULL WHERE folder_id = $1', [id]);
        const result = await query('DELETE FROM folders WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) return NextResponse.json({ message: 'Folder not found' }, { status: 404 });
        return NextResponse.json({ message: 'Folder deleted successfully' });
    } catch (error) {
        console.error('Error deleting folder:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
