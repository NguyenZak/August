import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateJWT } from '@/lib/auth';
import { slugify } from '@/lib/utils';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('cases')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching cases:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}

async function generateUniqueSlug(suggestedSlug: string, table: string, excludeId?: string): Promise<string> {
    let baseSlug = slugify(suggestedSlug);

    if (!baseSlug) baseSlug = 'case';

    let index = 0;
    let newSlug = baseSlug;

    while (true) {
        let query = supabase
            .from(table)
            .select('id')
            .eq('slug', newSlug);
        
        if (excludeId) {
            query = query.neq('id', excludeId);
        }

        const { data } = await query;

        if (!data || data.length === 0) {
            return newSlug;
        }
        index++;
        newSlug = `${baseSlug}-${index}`;
    }
}

export async function POST(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { title, slug: providedSlug, image_url, category, grid_row, grid_col, grid_row_span, grid_col_span, content, industry, menu_url } = body;

        if (!title) {
            return NextResponse.json({ message: 'Title is required' }, { status: 400 });
        }

        const slug = await generateUniqueSlug(providedSlug || title, 'cases');

        const { data, error } = await supabase
            .from('cases')
            .insert([{
                title,
                slug,
                image_url,
                category,
                grid_row,
                grid_col,
                grid_row_span,
                grid_col_span,
                content,
                industry,
                menu_url
            }])
            .select();

        if (error) throw error;
        return NextResponse.json(data[0], { status: 201 });
    } catch (error: any) {
        console.error('Error creating case:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
