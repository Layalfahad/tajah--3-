const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../db');

// GET /api/notifications
// Retrieves notifications for a specific user, sorted by newest first
router.get('/', async (req, res) => {
    try {
        const { user_id } = req.query;
        if (!user_id) {
            return res.status(400).json({ error: 'معرف المستخدم (user_id) مطلوب' });
        }
        const notifications = await dbAll(
            'SELECT id, user_id, title, message, type, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
            [user_id]
        );
        res.json(notifications);
    } catch (err) {
        console.error('Get notifications error:', err);
        res.status(500).json({ error: 'حدث خطأ في جلب الإشعارات' });
    }
});

// POST /api/notifications
// Creates a new notification for a specific user
router.post('/', async (req, res) => {
    try {
        const { user_id, title, message, type } = req.body;
        if (!user_id || !title || !message) {
            return res.status(400).json({ error: 'البيانات الأساسية للإشعار ناقصة (user_id, title, message)' });
        }
        const result = await dbRun(
            'INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)',
            [user_id, title, message, type || 'general']
        );
        res.status(201).json({ id: result.lastID, message: 'تم إرسال الإشعار بنجاح' });
    } catch (err) {
        console.error('Create notification error:', err);
        res.status(500).json({ error: 'حدث خطأ في إرسال الإشعار' });
    }
});

// DELETE /api/notifications/:id
// Deletes/dismisses a notification
router.delete('/:id', async (req, res) => {
    try {
        await dbRun('DELETE FROM notifications WHERE id = ?', [req.params.id]);
        res.json({ message: 'تم حذف الإشعار بنجاح' });
    } catch (err) {
        console.error('Delete notification error:', err);
        res.status(500).json({ error: 'حدث خطأ في حذف الإشعار' });
    }
});

module.exports = router;
