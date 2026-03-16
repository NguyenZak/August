import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateJWT } from '@/lib/auth';

export async function PUT(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { items } = body; // Array of { id, order_index }

        if (!Array.isArray(items)) {
            return NextResponse.json({ message: 'Items array is required' }, { status: 400 });
        }

        // We use a loop for updates here; for performance in larger datasets, a PG function would be better,
        // but for <10 hero slides, this is fine.
        const results = await Promise.all(
            items.map(item => 
                supabase
                    .from('hero_slides')
                    .update({ order_index: item.order_index })
                    .eq('id', item.id)
            )
        );

        const errors = results.filter(r => r.error);
        if (errors.length > 0) throw errors[0].error;

        return NextResponse.json({ message: 'Reordered successfully' });
    } catch (error: any) {
        console.error('Error reordering hero slides:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
