import { uploadToCloudinary } from './src/utils/cloudinary.js';
import pool from './src/config/database.js';
import fs from 'fs';
async function test() {
    try {
        console.log('Starting test...');
        const buffer = Buffer.from('test content');
        const result = await uploadToCloudinary(buffer);
        console.log('Cloudinary result:', result);
        const queryResult = await pool.query('INSERT INTO media (filename, url, public_id, resource_type, size) VALUES ($1, $2, $3, $4, $5) RETURNING *', ['test.txt', result.secure_url, result.public_id, result.resource_type, buffer.length]);
        console.log('Database result:', queryResult.rows[0]);
        process.exit(0);
    }
    catch (error) {
        console.error('Test failed:', error);
        process.exit(1);
    }
}
test();
//# sourceMappingURL=test-bulk-upload.js.map