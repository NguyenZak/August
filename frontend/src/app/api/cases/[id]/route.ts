import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateJWT } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        const queryStr = isUUID
            ? 'SELECT * FROM cases WHERE id = $1'
            : 'SELECT * FROM cases WHERE slug = $1';

        const result = await query(queryStr, [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Case not found' }, { status: 404 });
        }
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching case:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const body = await req.json();
        const { title, image_url, category, grid_row, grid_col, grid_row_span, grid_col_span, content, industry, menu_url } = body;

        const result = await query(
            'UPDATE cases SET title = $1, image_url = $2, category = $3, grid_row = $4, grid_col = $5, grid_row_span = $6, grid_col_span = $7, content = $8, industry = $9, menu_url = $10, updated_at = CURRENT_TIMESTAMP WHERE id = $11 RETURNING *',
            [title, image_url, category, grid_row, grid_col, grid_row_span, grid_col_span, content, industry, menu_url, id]
        );

        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Case not found' }, { status: 404 });
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating case:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const result = await query('DELETE FROM cases WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ message: 'Case not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Case deleted successfully' });
    } catch (error) {
        console.error('Error deleting case:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
