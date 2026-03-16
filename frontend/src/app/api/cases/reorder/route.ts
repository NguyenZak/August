import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateJWT } from '@/lib/auth';

export async function PUT(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { items } = body; // Array of { id, grid_row }

        if (!items || !Array.isArray(items)) {
            return NextResponse.json({ message: 'Invalid items array' }, { status: 400 });
        }

        const upsertData = items.map(item => ({
            id: item.id,
            grid_row: item.grid_row
        }));

        const { error } = await supabase
            .from('cases')
            .upsert(upsertData);

        if (error) throw error;

        return NextResponse.json({ message: 'Reordered successfully' });
    } catch (error: any) {
        console.error('Error reordering cases:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
