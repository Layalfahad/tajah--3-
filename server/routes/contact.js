const express = require('express');
const router = express.Router();
const { dbRun, dbAll } = require('../db');

// POST /api/contact — submit a contact form message
router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'الاسم والبريد والرسالة مطلوبين' });
        }
        const result = await dbRun(
            'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
            [name, email, subject || '', message]
        );
        res.status(201).json({ id: result.lastID, message: 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.' });
    } catch (err) {
        console.error('Contact error:', err);
        res.status(500).json({ error: 'حدث خطأ في إرسال الرسالة' });
    }
});

// GET /api/contact — list all messages (admin)
router.get('/', async (req, res) => {
    try {
        const messages = await dbAll('SELECT * FROM contact_messages ORDER BY created_at DESC');
        res.json(messages);
    } catch (err) {
        console.error('Get contact messages error:', err);
        res.status(500).json({ error: 'حدث خطأ' });
    }
});

// POST /api/newsletter — subscribe to newsletter
router.post('/newsletter', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'البريد الإلكتروني مطلوب' });
        await dbRun('INSERT OR IGNORE INTO newsletter (email) VALUES (?)', [email]);
        res.status(201).json({ message: 'تم الاشتراك في النشرة البريدية بنجاح! 🎉' });
    } catch (err) {
        console.error('Newsletter error:', err);
        res.status(500).json({ error: 'حدث خطأ في الاشتراك' });
    }
});

module.exports = router;
