import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
async function seedBrand() {
    console.log('Seeding demo brand...');
    const { data: profile } = await supabase.from('profiles').select('id').limit(1).single();
    if (!profile) {
        console.error('No profile found. Please create a user first.');
        return;
    }
    const { data, error } = await supabase.from('brands').upsert({
        owner_id: profile.id,
        name: 'Vertex Solutions',
        subdomain: 'vertex',
        hero_title: 'Build the Future with Vertex',
        hero_subtitle: 'The all-in-one platform for modern business management and social marketing.',
        primary_color: '#4F46E5',
        contact_email: 'hello@vertex.io',
        contact_phone: '+1 888 VERTEX',
    }).select();
    if (error) {
        console.error('Error seeding brand:', error);
    }
    else {
        console.log('Brand seeded successfully:', data);
    }
}
seedBrand();
//# sourceMappingURL=seed-brand.js.map