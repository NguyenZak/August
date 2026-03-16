import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateJWT } from '@/lib/auth';
import { slugify } from '@/lib/utils';

async function generateUniqueSlug(suggestedSlug: string, table: string, excludeId?: string): Promise<string> {
    let baseSlug = slugify(suggestedSlug);
    if (!baseSlug) baseSlug = 'service';
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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const body = await req.json();
        const { title, slug: providedSlug, description, category, icon, image_url } = body;

        let slug = providedSlug;
        if (slug) {
            slug = await generateUniqueSlug(slug, 'services', id);
        }

        const { data, error } = await supabase
            .from('services')
            .update({
                title,
                ...(slug && { slug }),
                description,
                category,
                icon,
                image_url,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            return NextResponse.json({ message: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json(data[0]);
    } catch (error: any) {
        console.error('Error updating service:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const { id } = await params;
        const { data, error } = await supabase
            .from('services')
            .delete()
            .eq('id', id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            return NextResponse.json({ message: 'Service not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Service deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting service:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
