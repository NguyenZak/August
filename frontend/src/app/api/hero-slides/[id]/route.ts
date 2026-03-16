import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateJWT } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { title_1, title_2, heading, video_url, order_index } = body;

        const { data, error } = await supabase
            .from('hero_slides')
            .update({ title_1, title_2, heading, video_url, order_index })
            .eq('id', params.id)
            .select();

        if (error) throw error;
        return NextResponse.json(data[0]);
    } catch (error: any) {
        console.error('Error updating hero slide:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { error } = await supabase
            .from('hero_slides')
            .delete()
            .eq('id', params.id);

        if (error) throw error;
        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting hero slide:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
