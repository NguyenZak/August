import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateJWT } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const result = await query('SELECT * FROM inquiries ORDER BY created_at DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, phone, company, message, businessModel, website, fanpage, project_type } = body;

        if (!name || !phone) {
            return NextResponse.json({ message: 'Name and phone are required' }, { status: 400 });
        }

        const result = await query(
            `INSERT INTO inquiries (name, email, phone, company, message, business_model, website, fanpage, project_type, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'new') RETURNING *`,
            [name, email || null, phone, company || null, message || null, businessModel || null, website || null, fanpage || null, project_type || 'Branding']
        );
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Error creating inquiry:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
