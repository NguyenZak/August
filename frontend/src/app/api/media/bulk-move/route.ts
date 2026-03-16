import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateJWT } from '@/lib/auth';

export async function POST(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { ids, folder_id } = body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ message: 'Invalid IDs' }, { status: 400 });
        }

        const { error } = await supabase
            .from('media')
            .update({ folder_id: folder_id === 'root' ? null : folder_id })
            .in('id', ids);

        if (error) throw error;

        return NextResponse.json({ message: 'Bulk move successful' });
    } catch (error: any) {
        console.error('Error bulk moving media:', error);
        return NextResponse.json({ message: 'Failed to move media', error: error.message }, { status: 500 });
    }
}
