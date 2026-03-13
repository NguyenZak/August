import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  console.log("Existing buckets:", buckets?.map(b => b.name), "List Error:", listError);
  
  if (!buckets?.some(b => b.name === 'media')) {
    const { data, error } = await supabase.storage.createBucket('media', { public: true });
    console.log("Create Bucket Result:", data, "Error:", error);
  } else {
    console.log("Bucket 'media' already exists.");
  }
}
test();
