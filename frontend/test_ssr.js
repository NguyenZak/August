const { createBrowserClient } = require('@supabase/ssr');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey);

// Mocking the cookies and window environment for SSR client in Node
const supabase = createBrowserClient(supabaseUrl, supabaseKey, {
    cookies: {
        getAll() { return [] },
        setAll() {}
    }
});

async function test() {
    console.log('Testing connection with createBrowserClient...');
    const { data, error } = await supabase.from('brands').select('*').limit(1);
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Success:', data);
    }
}

test();
