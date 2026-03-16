import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateJWT } from '@/lib/auth';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*');

        if (error) throw error;

        const settings = data.reduce((acc: any, row: any) => {
            acc[row.key] = row.value;
            return acc;
        }, {});
        return NextResponse.json(settings);
    } catch (error: any) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const user = authenticateJWT(req);
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    try {
        const settings = await req.json(); // Expecting { key: value, ... }

        const upsertData = Object.entries(settings).map(([key, value]) => ({
            key,
            value,
            updated_at: new Date().toISOString()
        }));

        const { error } = await supabase
            .from('site_settings')
            .upsert(upsertData, { onConflict: 'key' });

        if (error) throw error;

        return NextResponse.json({ message: 'Settings updated successfully' });
    } catch (error: any) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}
