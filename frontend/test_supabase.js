const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log('Testing connection...');
    const { data, error } = await supabase.from('brands').select('*').limit(1);
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Success:', data);
        if (data && data.length > 0) {
            console.log('Columns:', Object.keys(data[0]));
        } else {
            console.log('No data in brands table.');
            // Check for specific columns
            const { error: errorSub } = await supabase.from('brands').select('subdomain').limit(1);
            console.log('Column "subdomain" check:', errorSub ? 'Missing: ' + errorSub.message : 'Exists');
        }
    }
}

test();
