import pool from '../src/config/database.js';

async function seedPartners() {
    try {
        const partners = [
            { name: 'Apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', url: 'https://apple.com' },
            { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg', url: 'https://google.com' },
            { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg', url: 'https://meta.com' },
            { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg', url: 'https://microsoft.com' },
            { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', url: 'https://amazon.com' }
        ];

        for (const p of partners) {
            await pool.query(
                'INSERT INTO partners (name, logo, url) VALUES ($1, $2, $3)',
                [p.name, p.logo, p.url]
            );
        }
        console.log('Seeded 5 partners successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding partners:', err);
        process.exit(1);
    }
}

seedPartners();
