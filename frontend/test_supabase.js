const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    console.log('Testing connection...');
    const { data, error } = await supabase.from('media').select('*').limit(1);
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Success:', data);
    }
}

test();
