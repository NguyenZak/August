import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateJWT } from '@/lib/auth';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('hero_slides')
            .select('*')
            .order('order_index', { ascending: true });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching hero slides:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const body = await req.json();
        const { title_1, title_2, heading, video_url, order_index } = body;

        const { data, error } = await supabase
            .from('hero_slides')
            .insert([{ 
                title_1, 
                title_2, 
                heading, 
                video_url, 
                order_index: order_index || 0 
            }])
            .select();

        if (error) throw error;
        return NextResponse.json(data[0], { status: 201 });
    } catch (error: any) {
        console.error('Error creating hero slide:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
