import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateJWT } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const body = await req.json();
        const { status } = body;

        const { data, error } = await supabase
            .from('inquiries')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            return NextResponse.json({ message: 'Inquiry not found' }, { status: 404 });
        }

        return NextResponse.json(data[0]);
    } catch (error: any) {
        console.error('Error updating inquiry status:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const { data, error } = await supabase
            .from('inquiries')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            return NextResponse.json({ message: 'Inquiry not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Inquiry deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting inquiry:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
