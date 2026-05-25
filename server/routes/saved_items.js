const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../db');

// GET all saved items for a user
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const items = await dbAll('SELECT * FROM saved_items WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json(items);
    } catch (error) {
        console.error('Error fetching saved items:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء جلب العناصر المحفوظة' });
    }
});

// POST save an item
router.post('/', async (req, res) => {
    try {
        const { user_id, item_type, item_id } = req.body;
        
        // Check if already saved
        const existing = await dbGet('SELECT * FROM saved_items WHERE user_id = ? AND item_type = ? AND item_id = ?', [user_id, item_type, item_id]);
        
        if (existing) {
            return res.status(400).json({ error: 'العنصر محفوظ مسبقاً' });
        }
        
        const result = await dbRun('INSERT INTO saved_items (user_id, item_type, item_id) VALUES (?, ?, ?)', [user_id, item_type, item_id]);
        res.json({ id: result.lastID, message: 'تم الحفظ بنجاح' });
    } catch (error) {
        console.error('Error saving item:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء الحفظ' });
    }
});

// DELETE remove a saved item
router.delete('/:userId/:itemType/:itemId', async (req, res) => {
    try {
        const { userId, itemType, itemId } = req.params;
        const result = await dbRun('DELETE FROM saved_items WHERE user_id = ? AND item_type = ? AND item_id = ?', [userId, itemType, itemId]);
        
        if (result.changes === 0) {
            return res.status(404).json({ error: 'العنصر غير موجود' });
        }
        
        res.json({ message: 'تم الإزالة بنجاح' });
    } catch (error) {
        console.error('Error removing saved item:', error);
        res.status(500).json({ error: 'حدث خطأ أثناء الإزالة' });
    }
});

module.exports = router;
