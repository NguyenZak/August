import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateJWT } from '@/lib/auth';
import { slugify } from '@/lib/utils';

async function generateUniqueSlug(suggestedSlug: string, table: string, excludeId?: string): Promise<string> {
    let baseSlug = slugify(suggestedSlug);
    if (!baseSlug) baseSlug = 'item';
    let index = 0;
    let newSlug = baseSlug;
    while (true) {
        let query = supabase.from(table).select('id').eq('slug', newSlug);
        if (excludeId) query = query.neq('id', excludeId);
        const { data } = await query;
        if (!data || data.length === 0) return newSlug;
        index++;
        newSlug = `${baseSlug}-${index}`;
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

        let query = supabase.from('cases').select('*');
        if (isUUID) {
            query = query.eq('id', id);
        } else {
            query = query.eq('slug', id);
        }

        const { data, error } = await query.single();

        if (error || !data) {
            return NextResponse.json({ message: 'Case not found' }, { status: 404 });
        }
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching case:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const body = await req.json();
        const { title, slug: providedSlug, image_url, category, grid_row, grid_col, grid_row_span, grid_col_span, content, industry, menu_url } = body;

        let slug = providedSlug;
        if (slug) {
            slug = await generateUniqueSlug(slug, 'cases', id);
        }

        const { data, error } = await supabase
            .from('cases')
            .update({
                title,
                ...(slug && { slug }),
                image_url,
                category,
                grid_row,
                grid_col,
                grid_row_span,
                grid_col_span,
                content,
                industry,
                menu_url,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            return NextResponse.json({ message: 'Case not found' }, { status: 404 });
        }

        return NextResponse.json(data[0]);
    } catch (error: any) {
        console.error('Error updating case:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const { data, error } = await supabase
            .from('cases')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            return NextResponse.json({ message: 'Case not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Case deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting case:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
