import { query } from '../config/database.js';

export function createBaseSlug(title: string): string {
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

export async function generateUniqueSlug(title: string, table: string = 'cases', excludeId?: string): Promise<string> {
    const baseSlug = createBaseSlug(title || 'untitled');
    let finalSlug = baseSlug;
    let count = 1;

    while (true) {
        let sql = `SELECT id FROM ${table} WHERE slug = $1`;
        let params: any[] = [finalSlug];

        if (excludeId) {
            sql += ` AND id != $2`;
            params.push(excludeId);
        }

        const result = await query(sql, params);

        if (result.rowCount === 0) {
            return finalSlug; // Unique!
        }

        finalSlug = `${baseSlug}-${count}`;
        count++;
    }
}
