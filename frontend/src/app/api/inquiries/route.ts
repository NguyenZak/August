import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateJWT } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { data, error } = await supabase
            .from('inquiries')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching inquiries:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, phone, company, message, businessModel, website, fanpage, project_type } = body;

        if (!name || !phone) {
            return NextResponse.json({ message: 'Name and phone are required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('inquiries')
            .insert([{
                name,
                email: email || null,
                phone,
                company: company || null,
                message: message || null,
                business_model: businessModel || null,
                website: website || null,
                fanpage: fanpage || null,
                project_type: project_type || 'Branding',
                status: 'new'
            }])
            .select();

        if (error) throw error;
        return NextResponse.json(data[0], { status: 201 });
    } catch (error: any) {
        console.error('Error creating inquiry:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
