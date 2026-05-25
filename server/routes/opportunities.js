const express = require('express');
const router = express.Router();
const { dbRun, dbGet, dbAll } = require('../db');

// GET /api/opportunities
router.get('/', async (req, res) => {
    try {
        const { sport, city, status, club_id, search } = req.query;
        let sql = `SELECT o.*, u.name as club_name, u.club_initial, u.club_color, u.city as club_city,
                   (SELECT COUNT(*) FROM applications a WHERE a.opportunity_id = o.id) as applied_count
                   FROM opportunities o LEFT JOIN users u ON o.club_id = u.id WHERE 1=1`;
        const params = [];
        if (sport) { sql += ' AND o.sport = ?'; params.push(sport); }
        if (city) { sql += ' AND o.city = ?'; params.push(city); }
        if (status) { sql += ' AND o.status = ?'; params.push(status); }
        if (club_id) { sql += ' AND o.club_id = ?'; params.push(club_id); }
        if (search) {
            sql += ' AND (o.title LIKE ? OR o.description LIKE ? OR o.sport LIKE ? OR o.city LIKE ? OR u.name LIKE ?)';
            const s = '%' + search + '%';
            params.push(s, s, s, s, s);
        }
        sql += ' ORDER BY o.created_at DESC';
        const opportunities = await dbAll(sql, params);
        res.json(opportunities);
    } catch (err) {
        console.error('Get opportunities error:', err);
        res.status(500).json({ error: 'حدث خطأ في جلب الفرص' });
    }
});

// GET /api/opportunities/:id
router.get('/:id', async (req, res) => {
    try {
        const opp = await dbGet(
            `SELECT o.*, u.name as club_name, u.club_initial, u.club_color, u.city as club_city,
             (SELECT COUNT(*) FROM applications a WHERE a.opportunity_id = o.id) as applied_count
             FROM opportunities o LEFT JOIN users u ON o.club_id = u.id WHERE o.id = ?`,
            [req.params.id]
        );
        if (!opp) return res.status(404).json({ error: 'الفرصة غير موجودة' });
        res.json(opp);
    } catch (err) {
        console.error('Get opportunity error:', err);
        res.status(500).json({ error: 'حدث خطأ' });
    }
});

// POST /api/opportunities
router.post('/', async (req, res) => {
    try {
        const { club_id, title, description, sport, position, city, salary, duration, benefits } = req.body;
        if (!club_id || !title) {
            return res.status(400).json({ error: 'معرف النادي والعنوان مطلوبين' });
        }
        const result = await dbRun(
            'INSERT INTO opportunities (club_id, title, description, sport, position, city, salary, duration, benefits) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [club_id, title, description || '', sport || '', position || '', city || '', salary || '', duration || '', benefits || '']
        );
        res.status(201).json({ id: result.lastID, message: 'تم نشر الفرصة بنجاح' });
    } catch (err) {
        console.error('Create opportunity error:', err);
        res.status(500).json({ error: 'حدث خطأ في نشر الفرصة' });
    }
});

// PUT /api/opportunities/:id
router.put('/:id', async (req, res) => {
    try {
        const { title, description, sport, position, city, salary, duration, benefits, status } = req.body;
        const result = await dbRun(
            'UPDATE opportunities SET title = ?, description = ?, sport = ?, position = ?, city = ?, salary = ?, duration = ?, benefits = ?, status = ? WHERE id = ?',
            [title, description || '', sport || '', position || '', city || '', salary || '', duration || '', benefits || '', status || 'open', req.params.id]
        );
        if (result.changes === 0) {
            return res.status(404).json({ error: 'الفرصة غير موجودة' });
        }
        res.json({ message: 'تم تحديث الفرصة بنجاح' });
    } catch (err) {
        console.error('Update opportunity error:', err);
        res.status(500).json({ error: 'حدث خطأ في تحديث الفرصة' });
    }
});

module.exports = router;
