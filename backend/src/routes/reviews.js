import express from 'express';
import { query } from '../config/database.js';
import { authenticateJWT } from '../middleware/auth.js';
const router = express.Router();
// GET /api/reviews
router.get('/', async (req, res) => {
    try {
        const result = await query('SELECT * FROM reviews ORDER BY created_at DESC');
        res.json(result.rows);
    }
    catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// POST /api/reviews
router.post('/', authenticateJWT, async (req, res) => {
    const { author, position, content } = req.body;
    if (!author || !content) {
        return res.status(400).json({ message: 'Author and content are required' });
    }
    try {
        const result = await query('INSERT INTO reviews (author, position, content) VALUES ($1, $2, $3) RETURNING *', [author, position, content]);
        res.status(201).json(result.rows[0]);
    }
    catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// PUT /api/reviews/:id
router.put('/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { author, position, content } = req.body;
    try {
        const result = await query('UPDATE reviews SET author = $1, position = $2, content = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *', [author, position, content, id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json(result.rows[0]);
    }
    catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// DELETE /api/reviews/:id
router.delete('/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM reviews WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.json({ message: 'Review deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
export default router;
//# sourceMappingURL=reviews.js.map