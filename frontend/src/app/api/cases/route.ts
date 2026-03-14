import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateJWT } from '@/lib/auth';

export async function GET() {
    try {
        const result = await query('SELECT * FROM cases ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching cases:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

async function generateUniqueSlug(title: string, table: string): Promise<string> {
    let baseSlug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    if (!baseSlug) baseSlug = 'case';

    let index = 0;
    let newSlug = baseSlug;

    while (true) {
        const result = await query(`SELECT id FROM ${table} WHERE slug = $1`, [newSlug]);
        if (result.rowCount === 0) {
            return newSlug;
        }
        index++;
        newSlug = `${baseSlug}-${index}`;
    }
}

export async function POST(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { title, image_url, category, grid_row, grid_col, grid_row_span, grid_col_span, content, industry, menu_url } = body;

        if (!title) {
            return NextResponse.json({ message: 'Title is required' }, { status: 400 });
        }

        const slug = await generateUniqueSlug(title, 'cases');

        const result = await query(
            'INSERT INTO cases (title, slug, image_url, category, grid_row, grid_col, grid_row_span, grid_col_span, content, industry, menu_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
            [title, slug, image_url, category, grid_row, grid_col, grid_row_span, grid_col_span, content, industry, menu_url]
        );
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Error creating case:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
