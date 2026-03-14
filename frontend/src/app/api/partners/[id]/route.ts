import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateJWT } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const body = await req.json();
        const { name, logo, website } = body;

        const result = await query(
            'UPDATE partners SET name = $1, logo = $2, website = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
            [name, logo, website, id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Partner not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating partner:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const result = await query('DELETE FROM partners WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Partner not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Partner deleted successfully' });
    } catch (error) {
        console.error('Error deleting partner:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
