import pool from '../src/config/database.js';

async function seedHomepage() {
    try {
        console.log('Seeding homepage data...');

        // Clear existing (optional, but good for "syncing" clean)
        // await pool.query('DELETE FROM reviews');
        // await pool.query('DELETE FROM services');
        // await pool.query('DELETE FROM cases');

        // 1. Seed Services
        const servicesCount = await pool.query('SELECT COUNT(*) FROM services');
        if (parseInt(servicesCount.rows[0].count) === 0) {
            console.log('Adding services...');
            await pool.query(`
                INSERT INTO services (title, description, category, icon) VALUES
                ('sự kiện', 'Sự kiện đặc biệt, quản lý điểm đến và marketing trải nghiệm.', 'Events', 'Calendar'),
                ('marketing', 'Chiến lược nội dung, tự động hóa mạng xã hội và hợp tác sáng tạo.', 'Marketing', 'Megaphone')
            `);
        }

        // 2. Seed Reviews
        const reviewsCount = await pool.query('SELECT COUNT(*) FROM reviews');
        if (parseInt(reviewsCount.rows[0].count) === 0) {
            console.log('Adding reviews...');
            await pool.query(`
                INSERT INTO reviews (author, content, project) VALUES
                ('CMO, Global Fintech', 'August thực sự hiểu DNA của thương hiệu chúng tôi.', 'Đối tác chiến lược'),
                ('Giám đốc Marketing', 'Đội ngũ chuyên nghiệp và bám sát tiến độ.', 'Sự kiện Activation'),
                ('CEO, Tech Startup', 'Một trải nghiệm thương hiệu hoàn toàn khác biệt.', 'Branding & Social')
            `);
        }

        // 3. Seed Cases (6 items for a good grid)
        const casesCount = await pool.query('SELECT COUNT(*) FROM cases');
        if (parseInt(casesCount.rows[0].count) <= 1) { // 1 is just my "test" one
            console.log('Adding cases...');
            // Need real IDs or just let them generate
            const sampleCases = [
                {
                    title: 'Lễ hội Ánh sáng 2024',
                    category: 'Events',
                    image_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070',
                    grid_col: 1,
                    grid_col_span: 6
                },
                {
                    title: 'Chiến dịch "Sống Xanh"',
                    category: 'Marketing',
                    image_url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?q=80&w=2013',
                    grid_col: 7,
                    grid_col_span: 6
                },
                {
                    title: 'Tuần lễ Thời trang HN',
                    category: 'Events',
                    image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1976',
                    grid_col: 1,
                    grid_col_span: 12
                },
                {
                    title: 'Ra mắt VinFast EV',
                    category: 'Activation',
                    image_url: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=2072',
                    grid_col: 1,
                    grid_col_span: 8
                },
                {
                    title: 'Social Identity',
                    category: 'Branding',
                    image_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974',
                    grid_col: 9,
                    grid_col_span: 4
                }
            ];

            for (const c of sampleCases) {
                await pool.query(
                    'INSERT INTO cases (title, category, image_url, grid_col, grid_col_span) VALUES ($1, $2, $3, $4, $5)',
                    [c.title, c.category, c.image_url, c.grid_col, c.grid_col_span]
                );
            }
        }

        console.log('Homepage data seeded successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding homepage data:', error);
        process.exit(1);
    }
}

seedHomepage();
