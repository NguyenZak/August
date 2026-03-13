import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
)

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .normalize('NFD') // Remove accents
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/-+/g, '-'); // Collapse dashes
}

async function migrateSlugs() {
    console.log('Generating slugs for existing cases...')

    // 1. Fetch all cases
    const { data: cases, error: fetchError } = await supabase.from('cases').select('id, title')

    if (fetchError || !cases) {
        console.error('Error fetching cases:', fetchError)
        return
    }

    // 2. Add slugs
    for (const c of cases) {
        let baseSlug = generateSlug(c.title || 'untitled')
        let finalSlug = baseSlug
        let count = 1

        while (true) {
            // Check for collision
            const { data: existing, error: checkErr } = await supabase
                .from('cases')
                .select('id')
                .eq('slug', finalSlug)
                .neq('id', c.id) // check collisions with other rows

            if (checkErr) {
                console.error(`Error checking slug for ${c.title}:`, checkErr)
                break
            }

            if (!existing || existing.length === 0) {
                // Good to go
                break
            } else {
                finalSlug = `${baseSlug}-${count}`
                count++
            }
        }

        const { error: updateError } = await supabase
            .from('cases')
            .update({ slug: finalSlug })
            .eq('id', c.id)

        if (updateError) {
            console.error(`Error updating case ${c.id}:`, updateError)
        } else {
            console.log(`Successfully generated slug for "${c.title}" -> ${finalSlug}`)
        }
    }

    console.log('Done migrating slugs!')
}

migrateSlugs()
