import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateJWT } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const body = await req.json();
        const { author, position, content, project } = body;

        const result = await query(
            'UPDATE reviews SET author = $1, position = $2, content = $3, project = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
            [author, position, content, project, id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Review not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const result = await query('DELETE FROM reviews WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Review not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
