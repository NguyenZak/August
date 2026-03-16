import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateJWT } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const folder_id = req.nextUrl.searchParams.get('folder_id');
        let query = supabase.from('media').select('*');

        if (folder_id === 'root') {
            query = query.is('folder_id', null);
        } else if (folder_id) {
            query = query.eq('folder_id', folder_id);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching media:', error);
        return NextResponse.json({ message: 'Failed to fetch media', error: error.message }, { status: 500 });
    }
}
