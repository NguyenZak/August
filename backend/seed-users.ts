import { query } from './src/config/database.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

async function seedUsers() {
    const users = [
        { email: 'user@viz.vn', password: '123456', role: 'USER' },
        { email: 'admin@viz.vn', password: '123456', role: 'ADMIN' },
        { email: 'super@viz.vn', password: '123456', role: 'SUPER' }
    ];

    try {
        console.log('Starting to seed users...');

        // Clear existing users to avoid conflicts if needed, or just insert if don't exist
        for (const user of users) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            try {
                await query(
                    'INSERT INTO users (email, password, role) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET password = $2, role = $3',
                    [user.email, hashedPassword, user.role]
                );
                console.log(`User ${user.email} seeded successfully.`);
            } catch (err) {
                console.error(`Error seeding ${user.email}:`, err);
            }
        }

        console.log('Seeding finished.');
    } catch (error) {
        console.error('Error in seedUsers:', error);
    } finally {
        process.exit();
    }
}

seedUsers();
