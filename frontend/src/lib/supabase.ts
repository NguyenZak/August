import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ejxpjpzgddmbicallhjl.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'sb_publishable_hFSQqX9HOQtBta62DC_WcA_eKAs7cKn';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fallback to Supabase REST API if direct DB connection fails.
 * This helper mocks the behavior of pg's query for simple cases.
 */
export async function supabaseQuery(table: string, method: 'SELECT' | 'INSERT', data?: any) {
    let query = supabase.from(table);

    if (method === 'SELECT') {
        const { data: result, error } = await query.select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return { rows: result };
    } else if (method === 'INSERT') {
        const { data: result, error } = await query.insert(data).select();
        if (error) throw error;
        return { rows: result };
    }

    throw new Error(`Unsupported method: ${method}`);
}
