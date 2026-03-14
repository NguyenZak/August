import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateJWT } from '@/lib/auth';

export async function GET() {
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
        const { name, email, phone, company, message } = body;

        if (!name || !email || !message) {
            return NextResponse.json({ message: 'Name, email, and message are required' }, { status: 400 });
        }

        const result = await query(
            `INSERT INTO inquiries (name, email, phone, company, message, status) 
             VALUES ($1, $2, $3, $4, $5, 'new') RETURNING *`,
            [name, email, phone, company, message]
        );
        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        console.error('Error creating inquiry:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
